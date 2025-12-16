import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js"; // or correct path
import Patient from "../models/patient.model.js";

import {
    createAppointmentValidation,
    updateAppointmentValidation,
} from "../validation/appointment.validation.js";

const checkDoctorAvailability = async (doctorId, appointmentDate, startTime, endTime, excludeId = null) => {
    const conflict = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate: appointmentDate,
        status: { $ne: "cancelled" },

        // Exclude current appointment when updating
        ...(excludeId && { _id: { $ne: excludeId } }),

        // Overlap logic
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    });

    return conflict ? false : true;
};

export const getAllAppointmentsService = async (page, limit, search, ordering, startDate, endDate) => {
    const skip = (page - 1) * limit;
    const searchRegex = search ? new RegExp(search, "i") : null;

    let patientIds = [];
    let doctorIds = [];

    // 🔍 Search Logic
    if (searchRegex) {
        const matchedPatients = await Patient.find(
            {
                role: "patient",
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex }
                ]
            },
            { _id: 1 }
        );
        patientIds = matchedPatients.map((p) => p._id);

        const matchedDoctors = await User.find(
            {
                role: "doctor",
                $or: [
                    { name: searchRegex },
                ]
            },
            { _id: 1 }
        );
        doctorIds = matchedDoctors.map((d) => d._id);
    }

    // 👇 MAIN FILTER
    const searchFilter = {
        isActive: true,

        // Text search
        ...(search && {
            $or: [
                { reason: searchRegex },
                { notes: searchRegex },
                { status: searchRegex },
                { type: searchRegex },
                { patient: { $in: patientIds } },
                { doctor: { $in: doctorIds } },
            ]
        }),

        // 🟢 ADD DATE FILTER HERE
        ...(startDate && endDate
            ? {
                appointmentDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            }
            : {})
    };

    const sortOrder = ordering?.startsWith("-") ? -1 : 1;
    const sortField = ordering?.replace("-", "") || "appointmentDate";

    const appointments = await Appointment.find(searchFilter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("patient", "firstName lastName phone email")
        .populate("doctor", "name lastName email")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    const total = await Appointment.countDocuments(searchFilter);

    return {
        message: "Appointments fetched successfully",
        appointments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};


export const getAppointmentByIdService = async (id) => {
    const appointment = await Appointment.findById(id)
        .populate("patient", "firstName lastName phone email")
        .populate("doctor", "name phone email")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean();

    if (!appointment) throw new Error("Appointment not found");

    return {
        message: "Appointment fetched successfully",
        appointment,
    };
};

export const createAppointmentService = async (data) => {
    // Joi validation
    const { error } = createAppointmentValidation.validate(data);
    if (error) throw new Error(error.details[0].message);

    // Doctor availability check
    const isFree = await checkDoctorAvailability(
        data.doctor,
        data.appointmentDate,
        data.startTime,
        data.endTime
    );

    if (!isFree) {
        throw new Error("Doctor is not available at the selected time.");
    }

    const appointment = await Appointment.create(data);

    const populated = await Appointment.findById(appointment._id)
        .populate("patient", "name phone email")
        .populate("doctor", "name phone email")
        .populate("createdBy", "name email");

    return {
        message: "Appointment created successfully",
        appointment: populated,
    };
};

export const updateAppointmentService = async (id, updates) => {
    // Joi validation
    const { error } = updateAppointmentValidation.validate(updates);
    if (error) throw new Error(error.details[0].message);

    const appointment = await Appointment.findById(id);
    if (!appointment) throw new Error("Appointment not found");

    // Merged values
    const newDoctor = updates.doctor || appointment.doctor;
    const newDate = updates.appointmentDate || appointment.appointmentDate;
    const newStart = updates.startTime || appointment.startTime;
    const newEnd = updates.endTime || appointment.endTime;

    // Check availability for new values
    const isFree = await checkDoctorAvailability(
        newDoctor,
        newDate,
        newStart,
        newEnd,
        id
    );

    if (!isFree) {
        throw new Error("Doctor is not available at the selected time.");
    }

    Object.assign(appointment, updates);
    await appointment.save();

    const populated = await Appointment.findById(id)
        .populate("patient", "name phone email")
        .populate("doctor", "name phone email")
        .populate("updatedBy", "name email");

    return {
        message: "Appointment updated successfully",
        appointment: populated,
    };
};


export const deleteAppointmentService = async (id, userId) => {
    const appointment = await Appointment.findById(id);

    if (!appointment) throw new Error("Appointment not found");

    appointment.isActive = false;
    appointment.updatedBy = userId;

    await appointment.save();

    return { message: "Appointment deleted successfully" };
};
