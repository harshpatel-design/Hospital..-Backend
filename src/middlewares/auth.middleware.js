import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendError } from "../utils/responses.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ============================
// 🔐 VERIFY TOKEN MIDDLEWARE
// ============================
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendError(next, new Error("Authorization token missing"));
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return sendError(next, new Error("Invalid token format"));
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; // Contains { id, role, ... }

        next();
    } catch (err) {
        let message = "Unauthorized";

        if (err.name === "TokenExpiredError") {
            message = "Token has expired";
        } else if (err.name === "JsonWebTokenError") {
            message = "Invalid token";
        }

        return sendError(next, new Error(message));
    }
};

// ============================
// 🎯 ROLE AUTHORIZATION
// ============================
export const allowRoles = (...roles) => {
    let allowed = roles.flat(); // supports: "admin" OR ["admin"]

    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Access denied: No role found",
            });
        }

        if (!allowed.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: Insufficient permissions",
            });
        }

        next();
    };
};
