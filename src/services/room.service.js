import mongoose from "mongoose";
import FloorMaster from "../models/floor.model.js";
import RoomNumber from "../models/roomNumber.model.js";

export const getAllRoomsService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    const filter = {
        isActive: true,
        ...(search && {
            $or: [
                { roomNumber: { $regex: search, $options: "i" } },
                { roomType: { $regex: search, $options: "i" } },
            ],
        }),
    };

    const sortOrder = ordering?.startsWith("-") ? -1 : 1;
    const sortField = ordering?.replace("-", "") || "createdAt";

    const rooms = await RoomNumber.find(filter)
        .populate("floor", "name code floorNumber")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await RoomNumber.countDocuments(filter);

    return {
        message: "Rooms fetched successfully",
        rooms,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const getRoomByIdService = async (id) => {
    const room = await RoomNumber.findById(id)
        .populate("floor", "name code floorNumber")
        .lean();

    if (!room) throw new Error("Room not found");

    return {
        message: "Room fetched successfully",
        room,
    };
};


export const createRoomService = async (data, userId) => {
    const {
        roomNumber,
        floor,
        roomType,
        capacity,
        occupiedBeds = 0,
        amenities = [],
        notes,
        isActive = true,
    } = data;

    if (!mongoose.Types.ObjectId.isValid(floor)) {
        throw new Error("Invalid floor id");
    }
    const floorExists = await FloorMaster.findOne({
        _id: floor,
        isActive: true,
    }).lean();

    if (!floorExists) {
        throw new Error("Invalid or inactive floor");
    }

    if (occupiedBeds > capacity) {
        throw new Error("Occupied beds cannot exceed room capacity");
    }

    try {
        const room = await RoomNumber.create({
            roomNumber: roomNumber.trim().toUpperCase(),
            floor,
            roomType,
            capacity,
            occupiedBeds,
            amenities,
            notes,
            isActive,
            createdBy: userId,
            updatedBy: userId,
        });

        const populatedRoom = await RoomNumber.findById(room._id)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .populate("floor", "name code floorNumber");

        return {
            message: "Room created successfully",
            room: populatedRoom,
        };

    } catch (err) {

        if (err.code === 11000) {
            throw new Error(
                "Room number already exists on this floor"
            );
        }

        throw err;
    }
};


export const updateRoomService = async (id, updates, userId) => {
    console.log("updates", updates);

    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid room id");
    }

    const room = await RoomNumber.findOne({
        _id: id,
        isActive: true,
    });

    console.log("room", room);
    
    if (!room) {
        throw new Error("Room not found");
    }

    const capacity = updates.capacity ?? room.capacity;
    const occupiedBeds = updates.occupiedBeds ?? room.occupiedBeds;

    if (occupiedBeds > capacity) {
        throw new Error("Occupied beds cannot exceed room capacity");
    }

    if (updates.floor) {
        console.log("updates.floor", updates.floor);
        
        if (!mongoose.isValidObjectId(updates.floor)) {
            throw new Error("Invalid floor id");
        }

        const floorExists = await FloorMaster.findOne({
            _id: updates.floor,
            isActive: true,
        });

        console.log("floorExists", floorExists);
        
        if (!floorExists) {
            throw new Error("Invalid or inactive floor");
        }
    }

    Object.assign(room, updates);
    room.updatedBy = userId;

    await room.save();

    const populatedRoom = await RoomNumber.findById(room._id)
        .populate("updatedBy", "name email")
        .populate("floor", "name code floorNumber");

    return {
        message: "Room updated successfully",
        room: populatedRoom,
    };
};


export const deleteRoomService = async (id, userId) => {

    const room = await RoomNumber.findOneAndUpdate(
        { _id: id, isActive: true },
        {
            $set: {
                isActive: false,
                updatedBy: userId,
            },
        },
        {
            new: true,                          // return updated doc
        }
    )
        .populate("updatedBy", "name email");

    if (!room) {
        throw new Error("Room not found or already deleted");
    }

    return {
        message: "Room deleted successfully",
        room,
    };
};
