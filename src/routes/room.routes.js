import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

// import {
//   createRoomValidation,
// } from "../validation/room.validation.js";

import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

const router = express.Router();


router.post(
  "/create-room",
  verifyToken,
  allowRoles("admin"),
  // validateBody(createRoomValidation),
  createRoom
);

router.get(
  "/rooms",
  verifyToken,
  allowRoles("admin"),
  getAllRooms
);

router.get(
  "/rooms/:id",
  verifyToken,
  allowRoles("admin"),
  getRoomById
);

router.patch(
  "/rooms/:id",
  verifyToken,
  allowRoles("admin"),
  updateRoom
);
router.delete(
  "/rooms/:id",
  verifyToken,
  allowRoles("admin"),
  deleteRoom
);

export default router;
