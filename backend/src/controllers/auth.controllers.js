import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      role: role || "collaborator",
      authType: "email"
    });

    sendToken(user, 201, res);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ 
        message: "Invalid email or password" // Generic message for security
      });
    }

    console.log("User found, authType:", user.authType);
    
    if (user.authType !== "email") {
      return res.status(400).json({ 
        message: "Please use Google login for this account" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ 
        message: "Invalid email or password" 
      });
    }

    sendToken(user, 200, res);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login" 
    });
  }
};




export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            }).status(200).json({message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

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