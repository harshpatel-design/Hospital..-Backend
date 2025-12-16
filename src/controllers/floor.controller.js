import {
    getAllFloorsService,
    getFloorByIdService,
    createFloorService,
    updateFloorService,
    deleteFloorService,
} from "../services/floor.service.js";

import { sendSuccess, sendError } from "../utils/responses.js";

export const createFloor = async (req, res, next) => {
    try {
        const result = await createFloorService(
            req.body,
            req.user.id
        );

        return sendSuccess(res, 201, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const getAllFloors = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const ordering = req.query.ordering || "floorNumber";

        const result = await getAllFloorsService(
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

export const getFloorById = async (req, res, next) => {
    try {
        const result = await getFloorByIdService(req.params.id);

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const updateFloor = async (req, res, next) => {
    try {
        const result = await updateFloorService(
            req.params.id,
            req.body,
            req.user.id
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const deleteFloor = async (req, res, next) => {
    try {
        const result = await deleteFloorService(
            req.params.id,
            req.user.id
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};
