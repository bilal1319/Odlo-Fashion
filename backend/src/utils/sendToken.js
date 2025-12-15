import jwt from "jsonwebtoken";


export const sendToken = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            user: { id: user._id, name: user.name, role: user.role },
            token
        });
};
