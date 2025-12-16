import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {
  createUserService as createUser,
  findUserByEmailService,
  findUserByIdService,
  getAllUsersService,
  deleteUserService
} from "../services/user.service.js";

import User from "../models/user.model.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { sendEmail } from "../utils/email.js";

dotenv.config();

/* ============================================================
   REGISTER (Admin creates any user)
============================================================ */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, gender, age } = req.body;

    const user = await createUser({
      name,
      email,
      password,
      role,
      phone,
      gender,
      age
    });

    return sendSuccess(res, 201, {
      message: "User registered successfully",
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   RESET PASSWORD (For invited doctors)
============================================================ */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "reset_password") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmailService(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.password) {
      return res.status(400).json({
        message: "Password not set. Please use reset password email."
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return sendSuccess(res, 200, {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   LOGOUT
============================================================ */
export const logout = async (req, res) => {
  try {
    const tokenFromBody = req.body?.refreshToken;
    const header = req.headers.authorization;
    const tokenFromHeader = header ? header.split(" ")[1] : null;

    const refreshToken = tokenFromBody || tokenFromHeader;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.json({ message: "Logged out" });

    user.refreshToken = null;
    await user.save();

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   REFRESH TOKEN → NEW ACCESS TOKEN
============================================================ */
export const refreshTokenController = async (req, res, next) => {
  try {
    const tokenFromBody = req.body?.refreshToken;
    const header = req.headers.authorization;
    const tokenFromHeader = header ? header.split(" ")[1] : null;

    const refreshToken = tokenFromBody || tokenFromHeader;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token missing" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Expired refresh token" });

        const newAccessToken = jwt.sign(
          { id: decoded.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        return res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET ALL USERS (Pagination + Search + Sorting)
============================================================ */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const ordering = req.query.ordering || "userId";

    const result = await getAllUsersService(page, limit, search, ordering);

    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   CURRENT USER (ME)
============================================================ */
export const me = async (req, res, next) => {
  try {
    const user = await findUserByIdService(req.user.id);
    return sendSuccess(res, 200, { user });
  } catch (err) {
    return sendError(next, err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};