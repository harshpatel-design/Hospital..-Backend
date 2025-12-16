import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

import {
    createLabTestValidation,
    updateLabTestValidation,
} from "../validation/labTest.validation.js";

import {
    createLabTest,
    getAllLabTests,
    getLabTestById,
    updateLabTest,
    deleteLabTest,
} from "../controllers/labTest.controller.js";

const router = express.Router();

router.post(
    "/lab-tests",
    verifyToken,
    allowRoles("admin"),
    validateBody(createLabTestValidation),
    createLabTest
);

router.get(
    "/lab-tests",
    verifyToken,
    allowRoles("admin"),
    getAllLabTests
);

router.get(
    "/lab-tests/:id",
    verifyToken,
    allowRoles("admin"),
    getLabTestById
);

router.patch(
    "/lab-tests/:id",
    verifyToken,
    allowRoles("admin"),
    validateBody(updateLabTestValidation),
    updateLabTest
);

router.delete(
    "/lab-tests/:id",
    verifyToken,
    allowRoles("admin"),
    deleteLabTest
);

export default router;
