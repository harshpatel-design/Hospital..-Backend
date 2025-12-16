import dotenv from "dotenv";

import { sendSuccess, sendError } from "../utils/responses.js";
import * as labTestService from "../services/labTest.service.js";

dotenv.config();

/* ================= CREATE LAB TEST ================= */

export const createLabTest = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            createdBy: req.user.id,
            updatedBy: req.user.id,
        };

        const result = await labTestService.createLabTestService(payload);

        if (!result?.labTest) {
            return sendError(next, new Error("Lab test creation failed"));
        }

        return sendSuccess(res, 201, {
            message: "Lab test created successfully",
            labTest: result.labTest,
        });
    } catch (err) {
        console.error("Error in createLabTest:", err);
        return sendError(next, err);
    }
};

/* ================= GET ALL LAB TESTS ================= */

export const getAllLabTests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const ordering = req.query.ordering || "createdAt";

        const result = await labTestService.getAllLabTestsService(
            page,
            limit,
            search,
            ordering
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

/* ================= GET LAB TEST BY ID ================= */

export const getLabTestById = async (req, res, next) => {
    try {
        const result = await labTestService.getLabTestByIdService(
            req.params.id
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

/* ================= UPDATE LAB TEST ================= */

export const updateLabTest = async (req, res, next) => {
    try {
        const updateData = {
            ...req.body,
            updatedBy: req.user.id,
        };

        const result = await labTestService.updateLabTestService(
            req.params.id,
            updateData
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

/* ================= DELETE LAB TEST ================= */

export const deleteLabTest = async (req, res, next) => {
    try {
        const result = await labTestService.deleteLabTestService(
            req.params.id
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};
