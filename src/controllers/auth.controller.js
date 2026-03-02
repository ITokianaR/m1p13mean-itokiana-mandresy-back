import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  signUp,
  signIn,
  findOrCreateGoogleUser,
  forgotPassword,
  resetPassword
} from '../services/auth.service.js';
import { Router } from 'express';

const router = Router();

// CONFIGURATION PASSPORT 
export const initPassport = () => {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await findOrCreateGoogleUser({
          googleId: profile.id,
          email:    profile.emails[0].value,
          fullname: profile.displayName,
        });
        done(null, result);
      } catch (err) {
        done(err, null);
      }
    }
  ));
};

//  INSCRIPTION 
router.post('/register', async (req, res, next) => {
  try {
    const userCreated = await signUp(req.body);
    res.json({ userCreated });
  } catch (error) {
    next(error);
  }
});

//  CONNEXION 
router.post('/login', async (req, res, next) => {
  try {
    const userLogged = await signIn(req.body);
    res.json({ userLogged });
  } catch (error) {
    next(error);
  }
});

// GOOGLE : lancer l'authentification 
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// GOOGLE : callback après authentification 
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}?error=google_failed`
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}&role=${user.role}&username=${encodeURIComponent(user.username)}&fullname=${encodeURIComponent(user.fullname)}&id=${user._id}`
    );
  }
);

//  MOT DE PASSE OUBLIÉ 
router.post('/forgot-password', async (req, res, next) => {
  try {
    const result = await forgotPassword(req.body.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

//  RESET MOT DE PASSE 
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const result = await resetPassword(req.params.token, req.body.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;