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
    console.log("BODY:", req.body);

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.authType !== "email")
      return res.status(400).json({ message: "Use Google login instead" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, 200, res);

  } catch (err) {
    res.status(500).json({ message: err.message });
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