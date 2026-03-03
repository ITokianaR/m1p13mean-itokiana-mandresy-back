import User from '../models/user.model.js';
import Shop from '../models/shop.model.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

//  INSCRIPTION 
export const signUp = async (input) => {
  if (!input || !input.email || !input.username || !input.password || !input.fullname || !input.gender) {
    const error = new Error("Invalid input data");
    error.status = 400;
    throw error;
  }

  const username      = input.username;
  const fullname      = input.fullname;
  const gender        = input.gender;
  const email         = input.email.toLowerCase();
  const password      = input.password;
  const role          = input.role || 'client';
  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === 'shop') {
    if (!input.shopId) {
      const error = new Error("shopId is required for shop role");
      error.status = 400;
      throw error;
    }
    const existingShop = await Shop.findById(input.shopId);
    if (!existingShop) {
      const error = new Error("Shop not found");
      error.status = 404;
      throw error;
    }
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const error = new Error("Email already exists");
    error.status = 409;
    throw error;
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    const error = new Error("Username already exists");
    error.status = 409;
    throw error;
  }

  const user = await User.create({
    username,
    fullname,
    gender,
    email,
    password: hashedPassword,
    role,
    shop: role === 'shop' ? input.shopId : undefined,
  });

  const token = JWT.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

//  CONNEXION 
export const signIn = async (input) => {
  const email    = input.email;
  const password = input.password;

  if (!email) {
    const error = new Error("Email can't be blank");
    error.status = 400;
    throw error;
  }
  if (!password) {
    const error = new Error("Password can't be blank");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(`User with email: ${email} was not found.`);
    error.status = 404;
    throw error;
  }

  // Vérifier si c'est un compte Google sans mot de passe
  if (!user.password) {
    const error = new Error("Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.");
    error.status = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 400;
    throw error;
  }

  const token = JWT.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

// ─── GOOGLE OAUTH : trouver ou créer l'utilisateur
export const findOrCreateGoogleUser = async ({ googleId, email, fullname }) => {
  // 1. Chercher par googleId
  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      user.googleId = googleId;
      await user.save();
    } else {
      // 3. Créer un nouveau compte Google
      const baseUsername = email.split('@')[0];
      const randomSuffix = Math.random().toString(36).slice(2, 6);
      user = await User.create({
        googleId,
        email,
        fullname: fullname || 'Utilisateur Google',
        username: `${baseUsername}_${randomSuffix}`,
        gender:   'other',
        role:     'client',
        password: null,
      });
    }
  }

  const token = JWT.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

//  MOT DE PASSE OUBLIÉ 
export const forgotPassword = async (email) => {
  if (!email) {
    const error = new Error("Email requis.");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error("Aucun compte trouvé avec cet email.");
    error.status = 404;
    throw error;
  }

  // Vérifier si c'est un compte Google
  if (!user.password && user.googleId) {
    const error = new Error("Ce compte utilise Google. Vous ne pouvez pas réinitialiser le mot de passe.");
    error.status = 400;
    throw error;
  }

  // Générer un token sécurisé
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken   = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
  await user.save();

  // Configurer le transporteur email (Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password Gmail (pas ton vrai mdp)
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: `"MegaMall 🏬" <${process.env.EMAIL_USER}>`,
    to:   user.email,
    subject: ' Réinitialisation de votre mot de passe - MegaMall',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6c63ff; margin: 0;">🏬 MegaMall</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <h2 style="color: #333; margin-top: 0;">Réinitialisation du mot de passe</h2>
          <p style="color: #555;">Bonjour <strong>${user.fullname}</strong>,</p>
          <p style="color: #555;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #6c63ff, #5a52d5);
              color: white;
              border-radius: 10px;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
            ">Réinitialiser mon mot de passe</a>
          </div>
          <p style="color: #888; font-size: 13px; margin-bottom: 0;">
            ⏰ Ce lien expire dans <strong>1 heure</strong>.<br>
            Si vous n'avez pas fait cette demande, ignorez cet email.
          </p>
        </div>
      </div>
    `,
  });

  return { message: 'Email de réinitialisation envoyé avec succès.' };
};

//  RESET MOT DE PASSE 
export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    const error = new Error("Token et nouveau mot de passe requis.");
    error.status = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Le mot de passe doit contenir au moins 6 caractères.");
    error.status = 400;
    throw error;
  }

  // Trouver l'utilisateur avec le token valide et non expiré
  const user = await User.findOne({
    resetPasswordToken:   token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Lien invalide ou expiré. Veuillez refaire une demande.");
    error.status = 400;
    throw error;
  }

  // Hasher le nouveau mot de passe et nettoyer les champs reset
  user.password             = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken   = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.' };
};