// models/VerificationToken.js
import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  verificationCode: {
    type: String,
    required: true
  },
   purpose: {
    type: String,
    enum: ['signup', 'password-reset', 'email-change'],
    default: 'signup'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete when expiresAt passes
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('VerificationToken', verificationTokenSchema);