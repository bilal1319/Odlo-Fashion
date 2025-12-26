// controllers/authController.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model.js";
import VerificationToken from "../models/verificationToken.model.js";
import { sendToken } from "../utils/sendToken.js";
import { generateVerificationCode, sendPasswordChangeConfirmation, sendPasswordResetEmail, sendVerificationEmail } from "../utils/emailService.js";

// Helper: Generate random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// 1. Start signup - Just email
export const startSignup = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already has a user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    // Generate token and code
    const token = generateToken();
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Check if existing verification token for this email
    await VerificationToken.deleteMany({ email });

    // Create verification token
    await VerificationToken.create({
      token,
      email,
      verificationCode,
      expiresAt,
      status: 'pending'
    });

    // Send email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    
    if (!emailResult.success) {
      await VerificationToken.deleteOne({ token });
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send verification email" 
      });
    }

    res.json({
      success: true,
      token,
      message: "Verification code sent to email"
    });

  } catch (err) {
    console.error("Start signup error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 2. Verify email code
export const verifyEmailCode = async (req, res) => {
  try {
    const { token, code } = req.body;

    // Find token
    const verification = await VerificationToken.findOne({ 
      token, 
      verificationCode: code,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired verification code" 
      });
    }

    // Update status to verified
    verification.status = 'verified';
    await verification.save();

    // Return masked email for display
    const maskedEmail = verification.email.replace(
      /^(.)(.*)(@.)(.*)(\..+)$/,
      (match, p1, p2, p3, p4, p5) => 
        p1 + '*'.repeat(p2.length) + p3 + '*'.repeat(p4.length) + p5
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      email: verification.email,
      maskedEmail,
      token // Return same token for next step
    });

  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 3. Complete signup with password
export const completeSignup = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find verified token
    const verification = await VerificationToken.findOne({ 
      token, 
      status: 'verified',
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Session expired. Please start over." 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email: verification.email,
      username: verification.email.split('@')[0], // Simple username from email
      password: hashedPassword,
      role: "user",
      authType: "email",
      isVerified: true
    });

    // Delete verification token
    await VerificationToken.deleteOne({ token });

    // Send auth token
    sendToken(user, 201, res);

  } catch (err) {
    console.error("Complete signup error:", err);
    
    // Check if user already created (race condition)
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};


// 4. Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email, authType: 'email' });
    if (!user) {
      // Security: Always return success even if email doesn't exist
      return res.json({ 
        success: true, 
        message: "If an account exists, a reset code will be sent" 
      });
    }
    
    // ✅ ADD THIS: Check for existing valid token
    const existingToken = await VerificationToken.findOne({
      email,
      purpose: 'password-reset',
      expiresAt: { $gt: new Date() },
      status: 'pending'
    });
    
    if (existingToken) {
      // Return existing token
      return res.json({
        success: true,
        token: existingToken.token,
        message: "Reset code already sent. Please check your email."
      });
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    const verificationCode = generateVerificationCode(); // 6-digit
    
    // ✅ ADD THIS: Delete any old reset tokens
    await VerificationToken.deleteMany({ 
      email, 
      purpose: 'password-reset' 
    });
    
    await VerificationToken.create({
      token,
      email,
      verificationCode,
      purpose: 'password-reset',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      status: 'pending'
    });
    
    const emailResult = await sendPasswordResetEmail(email, verificationCode);
    
    // ✅ ADD THIS: Handle email sending failure
    if (!emailResult.success) {
      await VerificationToken.deleteOne({ token });
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send reset email" 
      });
    }
    
    res.json({
      success: true,
      token, // Send token to frontend
      message: "Reset code sent to email"
    });
    
  } catch (err) {
    console.error("Request reset error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};
export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const verification = await VerificationToken.findOne({
      token,
      purpose: 'password-reset',
      expiresAt: { $gt: new Date() }
    });
    
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link"
      });
    }
    
    res.json({
      success: true,
      email: verification.email
    });
    
  } catch (err) {
    console.error("Validate token error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 4. Verify Reset Code
export const verifyResetCode = async (req, res) => {
  try {
    const { token } = req.params;
    const { code } = req.body;
    
    const verification = await VerificationToken.findOne({
      token,
      verificationCode: code,
      purpose: 'password-reset',
      expiresAt: { $gt: new Date() }
    });
    
    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired code" 
      });
    }
    
    // Update status to verified
    verification.status = 'verified';
    await verification.save();
    
    res.json({
      success: true,
      email: verification.email,
      message: "Code verified successfully"
    });
    
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 5. Reset Password (Final Step)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find verified reset token
    const verification = await VerificationToken.findOne({
      token,
      purpose: 'password-reset',
      status: 'verified',
      expiresAt: { $gt: new Date() }
    });
    
    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired session" 
      });
    }
    
    // Update user password
    const user = await User.findOne({ email: verification.email });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    
    // Delete token (one-time use)
    await VerificationToken.deleteOne({ token });
    
    // Send confirmation email
    await sendPasswordChangeConfirmation(user.email);
    
    res.json({
      success: true,
      message: "Password updated successfully"
    });
    
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 6. Resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { token } = req.body;

    const verification = await VerificationToken.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        success: false, 
        message: "Session expired" 
      });
    }

    // Generate new code
    const newCode = generateVerificationCode();
    verification.verificationCode = newCode;
    verification.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await verification.save();

    // Send new email
    await sendVerificationEmail(verification.email, newCode);

    res.json({
      success: true,
      message: "New verification code sent"
    });

  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to resend code" 
    });
  }
};

// 7. Check token status (for page refresh)
export const checkTokenStatus = async (req, res) => {
  try {
    const { token } = req.params;

    const verification = await VerificationToken.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(404).json({ 
        success: false, 
        message: "Session expired" 
      });
    }

    // Mask email for display
    const maskedEmail = verification.email.replace(
      /^(.)(.*)(@.)(.*)(\..+)$/,
      (match, p1, p2, p3, p4, p5) => 
        p1 + '*'.repeat(p2.length) + p3 + '*'.repeat(p4.length) + p5
    );

    res.json({
      success: true,
      status: verification.status,
      maskedEmail,
      email: verification.email
    });

  } catch (err) {
    console.error("Check token error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// 8. Login (unchanged - for reference)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.authType !== "email") {
      return res.status(400).json({ 
        success: false,
        message: "Please use Google login for this account" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    sendToken(user, 200, res);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};


export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (unchanged)
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    }).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Keep admin login as is (unchanged)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin only." 
      });
    }

    if (user.authType !== "email") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid login method" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    sendToken(user, 200, res);

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};