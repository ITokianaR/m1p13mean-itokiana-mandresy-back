import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Null pour les comptes Google (pas de mot de passe local)
  password: {
    type: String,
    default: null
  },
  // ID Google OAuth2
  googleId: {
    type: String,
    default: null
  },
  // Token temporaire pour reset mot de passe
  resetPasswordToken: {
    type: String,
    default: null
  },
  // Expiration du token (1 heure)
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['client', 'shop', 'admin'],
    default: 'client'
  },
});

const User = mongoose.model("User", userSchema);
export default User;