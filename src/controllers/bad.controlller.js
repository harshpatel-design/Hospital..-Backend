import {
    createBedService,
    getAllBedsService,
    getBedByIdService,
    updateBedService,
    deleteBedService,
} from "../services/bed.service.js";

import { sendSuccess, sendError } from "../utils/responses.js";

export const createBed = async (req, res, next) => {
    try {
        const result = await createBedService(
            req.body,
            req.user.id
        );

        return sendSuccess(res, 201, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const getAllBeds = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";

        const filters = {
            floor: req.query.floor,
            ward: req.query.ward,
            room: req.query.room,
            bedType: req.query.bedType,
            bedLocationType: req.query.bedLocationType,
            isActive: req.query.isActive,
            isOccupied: req.query.isOccupied,
        };

        const result = await getAllBedsService({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            ...filters,
        });

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const getBedById = async (req, res, next) => {
    try {
        const result = await getBedByIdService(req.params.id);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const updateBed = async (req, res, next) => {
    try {
        const result = await updateBedService(
            req.params.id,
            req.body,
            req.user.id
        );
        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const deleteBed = async (req, res, next) => {
    try {
        const result = await deleteBedService(
            req.params.id,
            req.user.id
        );
        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};
