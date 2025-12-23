import {
  createWardService,
  getAllWardsService,
  getWardByIdService,
  updateWardService,
  deleteWardService,
} from "../services/ward.service.js";

import { sendSuccess, sendError } from "../utils/responses.js";

/* ================= CREATE WARD ================= */

export const createWard = async (req, res, next) => {
  try {
    const result = await createWardService(req.body, req.user.id);
    return sendSuccess(res, 201, result);
  } catch (err) {
    console.error("Error in createWard:", err);
    return sendError(next, err);
  }
};

export const getAllWards = async (req, res, next) => {
  try {
    const result = await getAllWardsService(req.query);
    return sendSuccess(res, 200, result);
  } catch (err) {
    console.error("Error in getAllWards:", err);
    return sendError(next, err);
  }
};

/* ================= GET WARD BY ID ================= */

export const getWardById = async (req, res, next) => {
  try {
    const result = await getWardByIdService(req.params.id);
    return sendSuccess(res, 200, result);
  } catch (err) {
    console.error("Error in getWardById:", err);
    return sendError(next, err);
  }
};

/* ================= UPDATE WARD ================= */

export const updateWard = async (req, res, next) => {
  try {
    const result = await updateWardService(
      req.params.id,
      req.body,
      req.user.id
    );

    return sendSuccess(res, 200, result);
  } catch (err) {
    console.error("Error in updateWard:", err);
    return sendError(next, err);
  }
};

/* ================= DELETE WARD (SOFT DELETE) ================= */

export const deleteWard = async (req, res, next) => {
  try {
    const result = await deleteWardService(
      req.params.id,
      req.user.id
    );

    return sendSuccess(res, 200, result);
  } catch (err) {
    console.error("Error in deleteWard:", err);
    return sendError(next, err);
  }
};
