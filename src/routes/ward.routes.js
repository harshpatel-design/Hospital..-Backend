import express from "express";

import {
    createWard,
    getAllWards,
    getWardById,
    updateWard,
    deleteWard,
} from "../controllers/ward.controller.js";

import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
    createWardValidation,
    updateWardValidation,
} from "../validation/WardMaster.validation.js";

const router = express.Router();
router.post(
    "/create-ward",
    verifyToken,
    allowRoles("admin"),
    validateBody(createWardValidation),
    createWard
);


router.get(
    "/wards",
    verifyToken,
    allowRoles("admin"),
    getAllWards
);

router.get(
    "/wards/:id",
    verifyToken,
    allowRoles("admin"),
    getWardById
);

router.patch(
    "/wards/:id",
    verifyToken,
    allowRoles("admin"),
    validateBody(updateWardValidation),
    updateWard
);

router.delete(
    "/wards/:id",
    verifyToken,
    allowRoles("admin"),
    deleteWard
);

export default router;
