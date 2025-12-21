import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
  );

  const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
  };

res
  .status(statusCode)
  .cookie("token", token, options)
  .json({
    success: true,
    user: { 
      id: user._id, 
      username: user.username, 
      email: user.email,       
      role: user.role 
    },
  });
};
