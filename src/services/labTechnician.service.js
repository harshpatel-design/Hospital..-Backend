import User from "../models/user.model.js";
import LabTechnician from "../models/labTechnician.model.js";
import bcrypt from "bcryptjs";

/* ============================================================
   GET ALL LAB TECHNICIANS
============================================================ */
export const getAllLabTechniciansService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    const searchFilter = {
        role: "lab_technician",
        ...(search && {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { gender: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } }
            ]
        })
    };

    const sortOrder = ordering.startsWith("-") ? -1 : 1;
    const sortField = ordering.replace("-", "");

    const users = await User.find(searchFilter)
        .select("name email phone gender age userId role createdAt")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);

    const technicians = await LabTechnician.find({ user: { $in: users.map(u => u._id) } })
        .populate("user", "name email phone gender age userId role createdAt")
        .lean();

    const mergedTechnicians = technicians.map(t => ({
        technicianId: t._id,
        ...t,              // technician details
        ...t.user          // user details
    }));

    const total = await User.countDocuments(searchFilter);

    return {
        message: "Lab technicians fetched successfully",
        technicians: mergedTechnicians,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

/* ============================================================
   GET BY USER ID (one merged object)
============================================================ */
export const getLabTechnicianByIdService = async (userId) => {
    const user = await User.findOne({ userId, role: "lab_technician" })
        .select("-password -refreshToken -__v");

    if (!user) throw new Error("Lab technician not found");

    const profile = await LabTechnician.findOne({ user: user._id }).select("-__v").lean();

    if (!profile) throw new Error("Lab technician profile not found");

    return {
        technicianId: profile._id,
        ...profile,
        ...user.toObject()
    };
};

/* ============================================================
   CREATE LAB TECHNICIAN
============================================================ */
export const createLabTechnicianService = async (data) => {
    const {
        name,
        email,
        phone,
        gender,
        age,
        lab,
        specialization,
        qualifications,
        experience,
        skills,
        shift,
        workSchedule,
        assignedTests,
        certifications,
        documents
    } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already in use");

    const user = await User.create({
        name,
        email,
        role: "lab_technician",
        phone,
        gender,
        age,
        password: null
    });

    const technician = await LabTechnician.create({
        user: user._id,
        lab,
        specialization,
        qualifications,
        experience,
        skills,
        shift,
        workSchedule,
        assignedTests,
        certifications,
        documents
    });

    return {
        message: "Lab technician created successfully",
        technician: {
            technicianId: technician._id,
            ...technician.toObject(),
            ...user.toObject()
        },
        user
    };
};

export const updateLabTechnicianService = async (userId, updates) => {
    const userUpdates = {};
    const techUpdates = {};

    const userFields = ["name", "email", "phone", "gender", "age", "role"];
    const techFields = [
        "lab", "specialization", "qualifications", "experience", "skills",
        "shift", "workSchedule", "assignedTests", "certifications", "documents", "status"
    ];

    for (const key in updates) {
        if (userFields.includes(key)) userUpdates[key] = updates[key];
        if (techFields.includes(key)) techUpdates[key] = updates[key];
    }

    if (updates.password) {
        userUpdates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findOneAndUpdate(
        { userId, role: "lab_technician" },
        userUpdates,
        { new: true }
    ).select("-password -refreshToken -__v");

    if (!user) throw new Error("Lab technician not found");

    const tech = await LabTechnician.findOneAndUpdate(
        { user: user._id },
        techUpdates,
        { new: true }
    ).lean();

    return {
        message: "Lab technician updated successfully",
        technician: {
            technicianId: tech._id,
            ...tech,
            ...user.toObject()
        }
    };
};
export const deleteLabTechnicianService = async (userId) => {
    const user = await User.findOne({ userId, role: "lab_technician" });
    if (!user) throw new Error("Lab technician not found");

    await LabTechnician.findOneAndDelete({ user: user._id });
    await User.findOneAndDelete({ _id: user._id });

    return { message: "Lab technician deleted successfully" };
};
