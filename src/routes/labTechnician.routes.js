import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createLabTechnicianValidation } from "../validation/labTechnician.validation.js";

import {
    createLabTechnician,
    getAllLabTechnicians,
    getLabTechnicianById,
    updateLabTechnician,
    deleteLabTechnician
} from "../controllers/labTechnician.controller.js";

const router = express.Router();

/* ============================================================
   CREATE LAB TECHNICIAN
============================================================ */
router.post(
    "/create-lab-technician",
    verifyToken,
    allowRoles("admin"),
    validateBody(createLabTechnicianValidation),
    createLabTechnician
);

/* ============================================================
   GET ALL LAB TECHNICIANS
============================================================ */
router.get(
    "/technicians",
    verifyToken,
    allowRoles("admin"),
    getAllLabTechnicians
);

/* ============================================================
   GET LAB TECHNICIAN BY USER ID (userId = Number)
============================================================ */
router.get(
    "/technicians/:userId",
    verifyToken,
    allowRoles("admin"),
    getLabTechnicianById
);

/* ============================================================
   UPDATE LAB TECHNICIAN
============================================================ */
router.patch(
    "/technicians/:userId",
    verifyToken,
    allowRoles("admin"),
    updateLabTechnician
);

/* ============================================================
   DELETE LAB TECHNICIAN
============================================================ */
router.delete(
    "/technicians/:userId",
    verifyToken,
    allowRoles("admin"),
    deleteLabTechnician
);

export default router;
