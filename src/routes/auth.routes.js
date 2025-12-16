import express from "express";
import User from "../models/user.model.js";

import {
  register,
  login,
  me,
  refreshTokenController,
  logout,
  getUsers,
  deleteUser
} from "../controllers/auth.controller.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { resetPasswordController } from "../controllers/resetpassword.controller.js";
import { uploadUserPhoto } from "../middlewares/uploadUserPhoto.js";


const router = express.Router();
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/users", verifyToken, allowRoles("admin"), getUsers);
router.delete(
  "/users/:id",
  verifyToken,
  allowRoles("admin"),
  deleteUser
);
router.get("/me", verifyToken, me);
router.post("/reset-password", resetPasswordController);
router.post(
  "/upload-image",
  verifyToken,
  uploadUserPhoto.single("image"),
  async (req, res) => {
    try {
      const imageUrl = `/uploads/users/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { image: imageUrl },
        { new: true }
      );

      return res.status(200).json({
        message: "Profile image updated successfully",
        data: user
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
router.post("/refresh-token", refreshTokenController);
export default router;
