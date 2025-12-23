import WardMaster from "../models/wardMaster.model.js";
import FloorMaster from "../models/floor.model.js";
import Department from "../models/department.model.js";

export const createWardService = async (payload, userId) => {
  const floor = await FloorMaster.findById(payload.floor);
  if (!floor) {
    throw new Error("Floor not found");
  }

  if (payload.department) {
    const department = await Department.findById(payload.department);
    if (!department) {
      throw new Error("Department not found");
    }
  }

  const ward = await WardMaster.create({
    ...payload,
    createdBy: userId,
  });

  return ward;
};

export const getAllWardsService = async (
  page = 1,
  limit = 10,
  search,
  ordering
) => {
  const skip = (page - 1) * limit;
  const searchRegex = search ? new RegExp(search, "i") : null;

  const filter = {
    ...(search && {
      $or: [
        { name: searchRegex },
        { code: searchRegex },
        { wardType: searchRegex },
      ],
    }),
  };

  const sortOrder = ordering?.startsWith("-") ? -1 : 1;
  const sortField = ordering?.replace("-", "") || "createdAt";

  const wards = await WardMaster.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate("floor", "name code floorNumber")
    .populate("department", "name code")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  const total = await WardMaster.countDocuments(filter);

  return {
    message: "Wards fetched successfully",
    wards,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getWardByIdService = async (id) => {
  const ward = await WardMaster.findOne({
    _id: id,
    isActive: true,
  })
    .populate("floor", "name code floorNumber")
    .populate("department", "name code")
    .populate("beds") // ✅ virtual populate
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!ward) {
    throw new Error("Ward not found");
  }

  return ward;
};

export const updateWardService = async (id, payload, userId) => {
  const ward = await WardMaster.findOne({
    _id: id
  });

  if (!ward) {
    throw new Error("Ward not found");
  }

  if (payload.floor) {
    const floor = await FloorMaster.findById(payload.floor);
    if (!floor) {
      throw new Error("Floor not found");
    }
  }

  if (payload.isActive) {
    const isActive = await WardMaster.findById(id);
    if (!isActive) {
      throw new Error("Ward is already inactive");
    }
  }

  if (payload.department) {
    const department = await Department.findById(payload.department);
    if (!department) {
      throw new Error("Department not found");
    }
  }

  Object.assign(ward, payload);
  ward.updatedBy = userId;

  await ward.save();
  return ward;
};

/* ================= DELETE WARD (SOFT DELETE) ================= */
export const deleteWardService = async (id) => {
  const ward = await WardMaster.findByIdAndDelete(id);

  if (!ward) {
    throw new Error("Ward not found");
  }

  return { message: "Ward deleted successfully" };
};