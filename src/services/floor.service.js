import FloorMaster from "../models/floor.model.js";
import {
    createFloorValidation,
    updateFloorValidation,
} from "../validation/floorMaster.validation.js";

export const getAllFloorsService = async (
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
                { floorNumber: Number(search) || -1 },
            ],
        }),
    };

    const sortOrder = ordering?.startsWith("-") ? -1 : 1;
    const sortField = ordering?.replace("-", "") || "floorNumber";

    const floors = await FloorMaster.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    const total = await FloorMaster.countDocuments(filter);

    return {
        message: "Floors fetched successfully",
        floors,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const getFloorByIdService = async (id) => {
    const floor = await FloorMaster.findById(id)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean();

    if (!floor) throw new Error("Floor not found");

    return {
        message: "Floor fetched successfully",
        floor,
    };
};

export const createFloorService = async (data, userId) => {
    const { error } = createFloorValidation.validate(data);
    if (error) throw new Error(error.details[0].message);

    const floor = await FloorMaster.create({
        ...data,
        createdBy: userId,
        updatedBy: userId, // same user on create
    });

    const populated = await FloorMaster.findById(floor._id)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    return {
        message: "Floor created successfully",
        floor: populated,
    };
};



export const updateFloorService = async (id, data, userId) => {
    console.log("data",data);
    
    const floor = await FloorMaster.findByIdAndUpdate(
        id,
        {
            ...data,
            updatedBy: userId,
        },
        { new: true, runValidators: true }
    )
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email");

    if (!floor) {
        throw new Error("Floor not found");
    }

    return {
        message: "Floor updated successfully",
        floor,
    };
};


export const deleteFloorService = async (id, userId) => {
    if (!userId) throw new Error("Unauthorized");

    const floor = await FloorMaster.findByIdAndDelete(id);

    if (!floor) {
        return { message: "Floor already deleted or not found" };
    }

    return { message: "Floor deleted successfully" };
};
