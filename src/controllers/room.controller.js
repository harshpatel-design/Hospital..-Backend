import dotenv from "dotenv";
import { sendSuccess, sendError } from "../utils/responses.js";
import * as roomService from "../services/room.service.js";

dotenv.config();

export const createRoom = async (req, res, next) => {

    try {
        const result = await roomService.createRoomService(
            req.body,
            req.user.id
        );
        return sendSuccess(res, 201, result);
    } catch (err) {
        console.error("Error in createRoom:", err);
        return sendError(next, err);
    }
};

export const getAllRooms = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const ordering = req.query.ordering || "createdAt";

        const result = await roomService.getAllRoomsService(
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

export const getRoomById = async (req, res, next) => {
    try {
        const result = await roomService.getRoomByIdService(req.params.id);
        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        console.log("req.params.id", req.params.id);
        console.log("req.user.id", req.user.id);

        /* 🔴 FIX 1: empty body guard */
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        /* 🔴 FIX 2: pass body directly */
        const result = await roomService.updateRoomService(
            req.params.id,
            req.body,          // ✅ no spreading needed
            req.user.id
        );

        return sendSuccess(res, 200, result);

    } catch (err) {
        return sendError(next, err);
    }
};



export const deleteRoom = async (req, res, next) => {
    try {
        const result = await roomService.deleteRoomService(
            req.params.id,
            req.user.id
        );

        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(next, err);
    }
};
