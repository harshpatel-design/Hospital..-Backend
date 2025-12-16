import express from "express";

import {
  createFloor,
  getAllFloors,
  getFloorById,
  updateFloor,
  deleteFloor,
} from "../controllers/floor.controller.js";

import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= FLOOR ROUTES ================= */

// Create floor (Admin only)
router.post(
  "/create-floors",
  verifyToken,
  allowRoles("admin"),
  createFloor
);

// Get all floors
router.get(
  "/floors",
  verifyToken,
  getAllFloors
);

// Get floor by ID
router.get(
  "/floors/:id",
  verifyToken,
  getFloorById
);

// Update floor (Admin only)
router.patch(
  "/floors/:id",
  verifyToken,
  allowRoles("admin"),
  updateFloor
);

// Delete floor (Admin only, soft delete)
router.delete(
  "/floors/:id",
  verifyToken,
  allowRoles("admin"),
  deleteFloor
);

export default router;
