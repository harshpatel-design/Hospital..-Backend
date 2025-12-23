import express from "express";

import {
    createBed,
    getAllBeds,
    getBedById,
    updateBed,
    deleteBed,
} from "../controllers/bad.controlller.js";

import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
    createBedValidation,
    updateBedValidation,
} from "../validation/bed.validation.js";

const router = express.Router();
router.post(
    "/create-bed",
    verifyToken,
    allowRoles("admin"),
    validateBody(createBedValidation),
    createBed
);

router.get(
    "/all-bed",
    verifyToken,
    allowRoles("admin"),
    getAllBeds
);

router.get(
    "/get-bed/:id",
    verifyToken,
    allowRoles("admin"),
    getBedById
);

router.patch(
    "/update-bed/:id",
    verifyToken,
    allowRoles("admin"),
    validateBody(updateBedValidation),
    updateBed
);

router.delete(
    "/delete-bed/:id",
    verifyToken,
    allowRoles("admin"),
    deleteBed
);

export default router;

















