/** ============================
 * Lab Technician Controller (Service Based - Clean)
 * ============================ */

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/responses.js";
import { sendEmail } from "../utils/email.js";

import {
  createLabTechnicianService,
  getAllLabTechniciansService,
  getLabTechnicianByIdService,
  updateLabTechnicianService,
  deleteLabTechnicianService
} from "../services/labTechnician.service.js";

dotenv.config();

/* ============================================================
   CREATE LAB TECHNICIAN
============================================================ */
export const createLabTechnician = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return sendError(next, new Error("Name and email are required"));
    }

    const { technician, user } = await createLabTechnicianService(req.body);

    // Generate reset password token
    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Hello ${name}</h2>
      <p>Your Lab Technician profile has been created.</p>
      <p>Please set your password using the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    try {
      await sendEmail(email, "Set your hospital account password", message);
    } catch (err) {
      console.error("Email failed:", err);
      return sendSuccess(res, 201, {
        message: "Lab Technician created, but email sending failed"
      });
    }

    return sendSuccess(res, 201, {
      message: "Lab Technician created successfully",
      resetLink: process.env.NODE_ENV !== "production" ? resetLink : undefined,
      technician
    });

  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   GET ALL LAB TECHNICIANS
============================================================ */
export const getAllLabTechnicians = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const ordering = req.query.ordering || "userId";

    const result = await getAllLabTechniciansService(page, limit, search, ordering);

    return sendSuccess(res, 200, result);

  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   GET LAB TECHNICIAN BY ID
============================================================ */
export const getLabTechnicianById = async (req, res, next) => {
  try {
    const technician = await getLabTechnicianByIdService(req.params.userId);
    return sendSuccess(res, 200, { technician });

  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   UPDATE LAB TECHNICIAN
============================================================ */
export const updateLabTechnician = async (req, res, next) => {
  try {
    const technician = await updateLabTechnicianService(req.params.userId, req.body);

    return sendSuccess(res, 200, technician);

  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   DELETE LAB TECHNICIAN
============================================================ */
export const deleteLabTechnician = async (req, res, next) => {
  try {
    const result = await deleteLabTechnicianService(req.params.userId);
    return sendSuccess(res, 200, result);

  } catch (err) {
    return sendError(next, err);
  }
};
