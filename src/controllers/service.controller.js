import {
    getAllServicesService,
    getServiceByIdService,
    createServiceService,
    updateServiceService,
    deleteServiceService,
} from "../services/service.service.js";

import { sendSuccess, sendError } from "../utils/responses.js";

// =====================================================
// ✅ GET ALL SERVICES (list with pagination, search, sort)
// =====================================================
export const getAllServices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const ordering = req.query.ordering || "-createdAt";

        const result = await getAllServicesService(page, limit, search, ordering);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

// =====================================================
// ✅ GET SERVICE BY ID
// =====================================================
export const getServiceById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await getServiceByIdService(id);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

// =====================================================
// ✅ CREATE SERVICE
// =====================================================
export const createService = async (req, res, next) => {
    try {
        const data = req.body;

        const result = await createServiceService(data);

        return sendSuccess(res, 201, result);
    } catch (err) {
        return sendError(next, err);
    }
};

// =====================================================
// ✅ UPDATE SERVICE
// =====================================================
export const updateService = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        const result = await updateServiceService(id, updates);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

// =====================================================
// ✅ DELETE SERVICE (Soft Delete)
// =====================================================
export const deleteService = async (req, res, next) => {
    try {
        const id = req.params.id;

        const result = await deleteServiceService(id);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};
