import dotenv from "dotenv";
import { sendSuccess, sendError } from "../utils/responses.js";
import * as appointmentService from "../services/appointment.service.js";

import {
    createAppointmentValidation,
    updateAppointmentValidation,
} from "../validation/appointment.validation.js";

dotenv.config();


export const createAppointment = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        payload.createdBy = req.user.id;
        // Auto-assign createdBy from logged-in user (if available)
        if (req.user?.id) {
            payload.createdBy = req.user.id;
        }

        // Validate request body
        const { error } = createAppointmentValidation.validate(payload);
        if (error) return sendError(next, new Error(error.details[0].message));

        const result = await appointmentService.createAppointmentService(payload);

        return sendSuccess(res, 201, result);

    } catch (err) {
        return sendError(next, err);
    }
};

/* ============================================================
   GET ALL APPOINTMENTS
============================================================ */
export const getAllAppointments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const ordering = req.query.ordering || "-appointmentDate";

        // ⭐ ADD THESE TWO ⭐
        const startDate = req.query.startDate || null;
        const endDate = req.query.endDate || null;

        const result = await appointmentService.getAllAppointmentsService(
            page,
            limit,
            search,
            ordering,
            startDate,
            endDate   // 👈 IMPORTANT!
        );

        return sendSuccess(res, 200, result);

    } catch (err) {
        return sendError(next, err);
    }
};


/* ============================================================
   GET APPOINTMENT BY ID
============================================================ */
export const getAppointmentById = async (req, res, next) => {
    try {
        const result = await appointmentService.getAppointmentByIdService(
            req.params.id
        );

        return sendSuccess(res, 200, result);

    } catch (err) {
        return sendError(next, err);
    }
};

/* ============================================================
   UPDATE APPOINTMENT
============================================================ */
export const updateAppointment = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        payload.updatedBy = req.user._id;
        // Add updatedBy from logged-in user
        if (req.user?._id) {
            payload.updatedBy = req.user.id;
        }

        const { error } = updateAppointmentValidation.validate(payload, {
            allowUnknown: true,
        });

        if (error) return sendError(next, new Error(error.details[0].message));

        const result = await appointmentService.updateAppointmentService(
            req.params.id,
            payload
        );

        return sendSuccess(res, 200, result);

    } catch (err) {
        return sendError(next, err);
    }
};

/* ============================================================
   DELETE (SOFT DELETE) APPOINTMENT
============================================================ */
export const deleteAppointment = async (req, res, next) => {
    try {
        const result = await appointmentService.deleteAppointmentService(
            req.params.id,
            req.user?._id
        );

        return sendSuccess(res, 200, result);

    } catch (err) {
        return sendError(next, err);
    }
};
