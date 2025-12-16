import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
    createServiceSchema,
    updateServiceSchema
} from "../validation/service.validation.js";

import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from "../controllers/service.controller.js";

const router = express.Router();

/* =====================================================
   CREATE SERVICE
   POST /api/services
===================================================== */
router.post(
    "/create-service",
    verifyToken,
    allowRoles("admin"),
    validateBody(createServiceSchema),
    createService
);

/* =====================================================
   GET ALL SERVICES
   GET /api/services
===================================================== */
router.get(
    "/",
    verifyToken,
    allowRoles("admin"),
    getAllServices
);

/* =====================================================
   GET SERVICE BY ID
   GET /api/services/:id
===================================================== */
router.get(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    getServiceById
);

/* =====================================================
   UPDATE SERVICE
   PATCH /api/services/:id
===================================================== */
router.patch(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    validateBody(updateServiceSchema),
    updateService
);

/* =====================================================
   DELETE SERVICE (Soft Delete)
   DELETE /api/services/:id
===================================================== */
router.delete(
    "/:id",
    verifyToken,
    allowRoles("admin"),
    deleteService
);

export default router;
