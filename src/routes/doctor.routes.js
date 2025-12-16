import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createDoctorSchema ,updateDoctorSchema  } from "../validation/doctor.validation.js";
import { uploadUserPhoto } from "../middlewares/uploadUserPhoto.js";

import {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} from "../controllers/doctor.controller.js";
import { parseMultipartJSON } from "../middlewares/parseMultipartJSON.js";

const router = express.Router();


/* -----------------------------------------------------------
   CREATE DOCTOR  (Admin Only)
----------------------------------------------------------- */
router.post(
    "/create-doctor",
    verifyToken,
    allowRoles("admin"),
    uploadUserPhoto.single("image"),
    parseMultipartJSON([ "education", "availability"]),
    validateBody(createDoctorSchema),
    createDoctor
);

/* -----------------------------------------------------------
   GET ALL DOCTORS  (Admin Only)
----------------------------------------------------------- */
router.get(
    "/doctors",
    verifyToken,
    allowRoles("admin"),
    getAllDoctors
);

/* -----------------------------------------------------------
   GET SINGLE DOCTOR  (Admin Only)
----------------------------------------------------------- */
router.get(
    "/doctors/:userId",
    verifyToken,
    allowRoles("admin"),
    getDoctorById
);

/* -----------------------------------------------------------
   UPDATE DOCTOR  (Admin Only)
----------------------------------------------------------- */
router.patch(
    "/doctors/:userId",
    verifyToken,
    allowRoles("admin"),
    uploadUserPhoto.single("image"),
    parseMultipartJSON(["education", "availability"]), 
    validateBody(updateDoctorSchema),
    updateDoctor
);

/* -----------------------------------------------------------
   DELETE DOCTOR  (Admin Only)
----------------------------------------------------------- */
router.delete(
    "/doctors/:userId",
    verifyToken,
    allowRoles("admin"),
    deleteDoctor
);

export default router;
