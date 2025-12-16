import mongoose from "mongoose";
import LabTest from "../models/labTest.model.js";

/* ================= GET ALL LAB TESTS ================= */

export const getAllLabTestsService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    const searchFilter = {
        ...(search && {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ],
        }),
    };

    const sortOrder = ordering?.startsWith("-") ? -1 : 1;
    const sortField = ordering?.replace("-", "") || "createdAt";

    const labTests = await LabTest.find(searchFilter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await LabTest.countDocuments(searchFilter);

    return {
        message: "Lab tests fetched successfully",
        labTests,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

/* ================= GET LAB TEST BY ID ================= */

export const getLabTestByIdService = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lab test ID");
    }

    const labTest = await LabTest.findById(id).lean();

    if (!labTest) {
        throw new Error("Lab test not found");
    }

    return {
        message: "Lab test fetched successfully",
        labTest,
    };
};

/* ================= CREATE LAB TEST ================= */

export const createLabTestService = async (data) => {
    const { name, code } = data;

    const existing = await LabTest.findOne({
        $or: [{ name }, { code }],
    });

    if (existing) {
        throw new Error("Lab test with same name or code already exists");
    }

    const created = await LabTest.create(data);

    const labTest = await LabTest.findById(created._id)
        .populate("createdBy", "_id name")
        .lean();

    return {
        message: "Lab test created successfully",
        labTest,
    };
};

/* ================= UPDATE LAB TEST ================= */

export const updateLabTestService = async (id, updates) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lab test ID");
    }

    const labTest = await LabTest.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    ).lean();

    if (!labTest) {
        throw new Error("Lab test not found");
    }

    return {
        message: "Lab test updated successfully",
        labTest,
    };
};

/* ================= DELETE LAB TEST ================= */

export const deleteLabTestService = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lab test ID");
    }

    const labTest = await LabTest.findByIdAndDelete(id);

    if (!labTest) {
        throw new Error("Lab test not found");
    }

    return {
        message: "Lab test deleted successfully",
    };
};
