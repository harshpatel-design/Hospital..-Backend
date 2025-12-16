import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { sendSuccess, sendError } from "../utils/responses.js";
import { sendEmail } from "../utils/email.js";

import * as recipientService from "../services/recipient.service.js";

dotenv.config();


export const createRecipient = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return sendError(next, new Error("Name and email are required"));
    }

    // CLEAN PAYLOAD
    const payload = { ...req.body };

    if (req.file) {
      payload.image = req.file.filename;
    } else {
      delete payload.image;
    }

    // CREATE RECIPIENT (User + Recipient)
    const result = await recipientService.createRecipientService(payload, req.file);
    const recipient = result.recipient;

    if (!recipient) {
      return sendError(next, new Error("Recipient creation failed"));
    }

    // 🟢 FIX: Use userObjectId (Mongo ID) for JWT
    const userId = recipient.userObjectId;

    if (!userId) {
      return sendError(next, new Error("User ID not found in recipient data"));
    }

    // CREATE RESET TOKEN
    const resetToken = jwt.sign(
      { id: userId.toString(), purpose: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // RESET PASSWORD LINK
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // EMAIL MESSAGE
    const message = `
      <h2>Hello ${name}</h2>
      <p>Your recipient account has been created.</p>
      <p>Please set your password using the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    // SEND EMAIL (safe)
    try {
      await sendEmail(email, "Set your hospital account password", message);
    } catch (err) {
      console.error("Email failed:", err);
    }

    // SUCCESS RESPONSE
    return sendSuccess(res, 201, {
      message: "Recipient created successfully",
      recipient,
      resetToken,
      resetLink
    });

  } catch (err) {
    return sendError(next, err);
  }
};



// ======================================================
// 🟢 GET ALL RECIPIENTS
// ======================================================
export const getAllRecipients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const ordering = req.query.ordering || "userId";

    const result = await recipientService.getAllRecipientsService(
      page,
      limit,
      search,
      ordering
    );

    return sendSuccess(res, 200, result);

  } catch (err) {
    return sendError(next, err);
  }
};



// ======================================================
// 🟢 GET RECIPIENT BY ID
// ======================================================
export const getRecipientById = async (req, res, next) => {
  try {
    const recipient = await recipientService.getRecipientByIdService(req.params.userId);

    return sendSuccess(res, 200, { recipient });

  } catch (err) {
    return sendError(next, err);
  }
};



// ======================================================
// 🟢 UPDATE RECIPIENT
// ======================================================
export const updateRecipient = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // REMOVE image key if no file uploaded
    if (!req.file) {
      delete updateData.image;
    }

    // CALL SERVICE
    const result = await recipientService.updateRecipientService(
      req.params.userId,
      updateData,
      req.file
    );

    return sendSuccess(res, 200, result);

  } catch (err) {
    return sendError(next, err);
  }
};



// ======================================================
// 🟢 DELETE RECIPIENT
// ======================================================
export const deleteRecipient = async (req, res, next) => {
  try {
    const result = await recipientService.deleteRecipientService(req.params.userId);
    return sendSuccess(res, 200, result);

  } catch (err) {
    return sendError(next, err);
  }
};
