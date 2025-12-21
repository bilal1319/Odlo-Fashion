import jwt from "jsonwebtoken";
import  User  from "../models/user.model.js";

//Token Verification Middleware
export const protect = async (req, res, next) => {
    console.log("Auth Middleware: Verifying token", req.cookies.token);
    const token = req.cookies.token;

    if (!token)
        return res.status(401).json({ message: "Not authenticated" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


//Role Based Access Control Middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

