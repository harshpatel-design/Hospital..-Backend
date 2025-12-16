import dotenv from "dotenv";
import { sendSuccess, sendError } from "../utils/responses.js";
import * as patientService from "../services/patient.service.js";
import Patient from "../models/patient.model.js";

import {
  createPatientValidation,
  updatePatientValidation,
} from "../validation/patient.validation.js";

dotenv.config();

/* ============================================================
   CREATE PATIENT (documents + billing via service)
============================================================ */
export const createPatient = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // 📎 Attach uploaded documents
    if (req.files?.length > 0) {
      payload.documents = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.filename,
      }));
    }

    // ✅ Validate request
    const { error } = createPatientValidation.validate(payload);
    if (error) {
      return sendError(next, new Error(error.details[0].message));
    }

    // ✅ Create patient + charge (handled in service)
    const result = await patientService.createPatientService(payload);

    return sendSuccess(res, 201, {
      message: "Patient created successfully",
      patient: result.patient,
    });
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   GET ALL PATIENTS
============================================================ */
export const getAllPatients = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const ordering = req.query.ordering || "-createdAt";

    const result = await patientService.getAllPatientService(
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

/* ============================================================
   GET PATIENT BY ID
============================================================ */
export const getPatientById = async (req, res, next) => {
  try {
    const result = await patientService.getAllPatientByIdService(
      req.params.id
    );

    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   UPDATE PATIENT (NO AUTO BILLING HERE)
============================================================ */
export const updatePatient = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // 📎 Append new documents
    if (req.files?.length > 0) {
      payload.documents = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.filename,
      }));
    }

    // ✅ Validate update payload
    const { error } = updatePatientValidation.validate(payload, {
      allowUnknown: true,
    });

    if (error) {
      return sendError(next, new Error(error.details[0].message));
    }

    const result = await patientService.updatePatientService(
      req.params.id,
      payload
    );

    return sendSuccess(res, 200, {
      message: "Patient updated successfully",
      patient: result.patient,
    });
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   DELETE PATIENT (SOFT DELETE)
============================================================ */
export const deletePatient = async (req, res, next) => {
  try {
    const result = await patientService.deletePatientService(req.params.id);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

/* ============================================================
   GET PATIENT NAMES (DROPDOWN)
============================================================ */
export const getPatientNames = async (req, res, next) => {
  try {
    const { search = "", sort = "asc" } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query)
      .select("firstName lastName _id")
      .sort({ firstName: sort === "desc" ? -1 : 1 });

    const formatted = patients.map((p) => ({
      _id: p._id,
      name: `${p.firstName} ${p.lastName || ""}`.trim(),
    }));

    return sendSuccess(res, 200, {
      count: formatted.length,
      patients: formatted,
    });
  } catch (err) {
    return sendError(next, err);
  }
};
