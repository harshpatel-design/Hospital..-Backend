import BedMaster from "../models/bad.model.js";
import WardMaster from "../models/wardMaster.model.js";
import RoomMaster from "../models/roomNumber.model.js";
import FloorMaster from "../models/floor.model.js"
import mongoose from "mongoose";

export const createBedService = async (payload, userId) => {
    const {
        bedLocationType,
        ward,
        room,
        floor,
        bedNumber,
    } = payload;
    
    const floorExists = await FloorMaster.findById(floor);
    console.log(floorExists);
    if (!floorExists) {
        throw new Error("Floor not found");
    }

    if (bedLocationType === "WARD") {
        const wardExists = await WardMaster.findById(ward);
        if (!wardExists) throw new Error("Ward not found");

        if (String(wardExists.floor) !== String(floor)) {
            throw new Error("Ward does not belong to this floor");
        }
    }

    if (bedLocationType === "ROOM") {
        const roomExists = await RoomMaster.findById(room);
        if (!roomExists) throw new Error("Room not found");

        if (String(roomExists.floor) !== String(floor)) {
            throw new Error("Room does not belong to this floor");
        }
    }

    const duplicateQuery =
        bedLocationType === "WARD"
            ? { bedNumber, ward, isActive: true }
            : { bedNumber, room, isActive: true };

    const alreadyExists = await BedMaster.findOne(duplicateQuery);
    if (alreadyExists) {
        throw new Error("Bed number already exists in this location");
    }

    const bed = await BedMaster.create({
        ...payload,
        createdBy: userId,
    });

    const populatedBed = await BedMaster.findById(bed._id)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .populate("ward", "name code")
        .populate("room", "roomNumber")
        .populate("floor", "name code");

    return populatedBed
};

export const getAllBedsService = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",

        floor,
        ward,
        room,
        bedType,
        bedLocationType,
        isActive,
        isOccupied,
    } = query;

    const filter = {};

    if (floor) filter.floor = floor;
    if (bedType) filter.bedType = bedType;
    if (bedLocationType) filter.bedLocationType = bedLocationType;

    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    if (isOccupied !== undefined) {
        filter.isOccupied = isOccupied === "true";
    }

    if (ward) {
        filter.ward = ward;
        filter.bedLocationType = "WARD";
    }

    if (room) {
        filter.room = room;
        filter.bedLocationType = "ROOM";
    }

    if (search) {
        filter.$or = [
            { bedNumber: { $regex: search, $options: "i" } },
        ];
    }

    const sort = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
        BedMaster.find(filter)
            .populate("ward", "name code wardType")
            .populate("room", "roomNumber roomType")
            .populate("floor", "name code")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit)),

        BedMaster.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
        },
    };
};


export const getBedByIdService = async (id) => {
    const bed = await BedMaster.findById(id)
        .populate("ward", "name code wardType")
        .populate("room", "roomNumber roomType")
        .populate("floor", "name code");

    if (!bed) throw new Error("Bed not found");

    return bed;
};

export const updateBedService = async (id, payload, userId) => {
    const bed = await BedMaster.findById(id);
    if (!bed) throw new Error("Bed not found");

    Object.assign(bed, payload);
    bed.updatedBy = userId;

    await bed.save();
    return bed;
};

export const deleteBedService = async (id, userId) => {
    const bed = await BedMaster.findByIdAndDelete(id);
    if (!bed) throw new Error("Bed not found");
    return { message: "Bed deleted successfully" };
};
