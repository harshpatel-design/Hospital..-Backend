import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { uploadUserPhoto } from "../middlewares/uploadUserPhoto.js";

import { 
    createRecipientSchema,
    updateRecipientSchema
} from "../validation/recipient.validation.js";


import {
    createRecipient,
    getAllRecipients,
    getRecipientById,
    updateRecipient,
    deleteRecipient
} from "../controllers/recipient.controller.js";

const router = express.Router();

router.post(
    "/create-recipient",
    verifyToken,
    allowRoles("admin"),
    uploadUserPhoto.single("image"),
    validateBody(createRecipientSchema),

    createRecipient
);

router.get(
    "/recipients",
    verifyToken,
    allowRoles("admin"),
    getAllRecipients
);
router.get(
    "/recipients/:userId",
    verifyToken,
    allowRoles("admin"),
    getRecipientById
);
router.patch(
    "/recipients/:userId",
    verifyToken,
    allowRoles("admin"),
    uploadUserPhoto.single("image"),

    validateBody(updateRecipientSchema),
    updateRecipient
);

router.delete(
    "/recipients/:userId",
    verifyToken,
    allowRoles("admin"),
    deleteRecipient
);

export default router;
