import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
  createPatientValidation,
  updatePatientValidation
} from "../validation/patient.validation.js";

import { uploadDocuments } from "../middlewares/uploadDocuments.js";

import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientNames
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get(
  "/patients-names",
  verifyToken,
  allowRoles("admin", "doctor", "receptionist"), // ⭐ same access like getAllPatients
  getPatientNames
);

/* ============================================================
   CREATE PATIENT  (supports multiple documents[])
============================================================ */
router.post(
  "/patients",
  verifyToken,
  allowRoles("admin", "receptionist"),

  // MULTIPLE FILE UPLOAD
  uploadDocuments.array("documents", 10),

  // Parse nested JSON
  (req, res, next) => {
    try {
      const jsonFields = ["address", "vitals", "emergency", "opd", "ipd", "insurance"];
      jsonFields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON format" });
    }
  },

  validateBody(createPatientValidation),
  createPatient
);


/* ============================================================
   GET ALL PATIENTS
============================================================ */
router.get(
  "/patients",
  verifyToken,
  allowRoles("admin", "receptionist", "doctor"),
  getAllPatients
);

/* ============================================================
   GET PATIENT BY ID
============================================================ */
router.get(
  "/patients/:id",
  verifyToken,
  allowRoles("admin", "receptionist", "doctor"),
  getPatientById
);

/* ============================================================
   UPDATE PATIENT  (append new documents)
============================================================ */
router.patch(
  "/patients/:id",
  verifyToken,
  allowRoles("admin", "receptionist"),

  uploadDocuments.array("documents", 10),

  (req, res, next) => {
    try {
      const jsonFields = ["address", "vitals", "emergency", "opd", "ipd", "insurance"];
      jsonFields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON" });
    }
  },

  validateBody(updatePatientValidation),
  updatePatient
);


/* ============================================================
   DELETE PATIENT
============================================================ */
router.delete(
  "/patients/:id",
  verifyToken,
  allowRoles("admin"),
  deletePatient
);

export default router;
