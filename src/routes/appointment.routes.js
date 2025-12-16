import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
    createAppointmentValidation,
    updateAppointmentValidation
} from "../validation/appointment.validation.js";

import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from "../controllers/appointment.controller.js";

const router = express.Router();

/* -----------------------------------------------------------
   CREATE APPOINTMENT (Admin, Doctor, Staff)
----------------------------------------------------------- */
router.post(
    "/",
    verifyToken,
    allowRoles("admin", "doctor", "staff"),
    validateBody(createAppointmentValidation),
    createAppointment
);

/* -----------------------------------------------------------
   GET ALL APPOINTMENTS (Admin, Doctor, Staff)
----------------------------------------------------------- */
router.get(
    "/",
    verifyToken,
    allowRoles("admin", "doctor", "staff"),
    getAllAppointments
);

/* -----------------------------------------------------------
   GET APPOINTMENT BY ID (Admin, Doctor, Staff)
----------------------------------------------------------- */
router.get(
    "/:id",
    verifyToken,
    allowRoles("admin", "doctor", "staff"),
    getAppointmentById
);

/* -----------------------------------------------------------
   UPDATE APPOINTMENT (Admin, Doctor, Staff)
----------------------------------------------------------- */
router.patch(
    "/:id",
    verifyToken,
    allowRoles("admin", "doctor", "staff"),
    validateBody(updateAppointmentValidation),
    updateAppointment
);

/* -----------------------------------------------------------
   DELETE APPOINTMENT (Soft Delete) (Admin Only)
----------------------------------------------------------- */
router.delete(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    deleteAppointment
);

export default router;
