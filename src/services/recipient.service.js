import User from "../models/user.model.js";
import Recipient from "../models/recipient.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const getAllRecipientsService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    const searchFilter = {
        role: "recipient",
        ...(search && {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { gender: { $regex: search, $options: "i" } }
            ]
        })
    };

    const sortOrder = ordering.startsWith("-") ? -1 : 1;
    const sortField = ordering.replace("-", "");

    // 1️⃣ Get users with role recipient
    const users = await User.find(searchFilter)
        .select("name email phone gender age role userId image createdAt")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);

    // 2️⃣ Get all recipient profiles for those users
    const recipients = await Recipient.find({ user: { $in: users.map(u => u._id) } })
        .populate("user", "name email phone gender age userId image createdAt")
        .lean();

    // 3️⃣ Merge recipient data with user data
    const mergedRecipients = recipients.map(rec => {
        const user = rec.user;
        return {
            recipientId: rec._id,
            ...rec,
            ...user,
            user: undefined,
        };
    });

    const total = await Recipient.countDocuments({
        user: { $in: users.map(u => u._id) }
    });

    return {
        message: "Recipients fetched successfully",
        recipients: mergedRecipients,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};

export const getRecipientByIdService = async (userId) => {
    const user = await User.findOne({ userId, role: "recipient" })
        .select("-password -refreshToken -__v");

    if (!user) throw new Error("Recipient not found");

    const profile = await Recipient.findOne({ user: user._id })
        .populate("user", "-password -refreshToken -__v")
        .lean();

    if (!profile) throw new Error("Recipient profile not found");

    return {
        message: "Recipient fetched successfully",
        recipient: {
            recipientId: profile._id,
            ...profile,
            ...profile.user,
            user: undefined
        }
    };
};
export const createRecipientService = async (data, file) => {
    const {
        name,
        email,
        phone,
        gender,
        age,
        salary,
        shift,
        time,
        address,
        emergencyContact,
        aadharNumber,
        panNumber,
        note
    } = data;

    if (await User.findOne({ email })) {
        throw new Error("Email already in use");
    }

    // 1️⃣ Create USER
    const user = await User.create({
        name,
        email,
        phone,
        gender,
        age,
        role: "recipient",
        password: null,
        image: file ? file.filename : null
    });

    // 2️⃣ Create RECIPIENT profile
    const recipient = await Recipient.create({
        user: user._id,
        salary,
        shift,
        time,
        address,
        emergencyContact,
        aadharNumber,
        panNumber,
        note
    });

    // 3️⃣ Get populated object
    const populated = await Recipient.findById(recipient._id)
        .populate("user", "-password -refreshToken -__v")
        .lean();

    return {
        message: "Recipient created successfully",

        recipient: {
            recipientId: populated._id,

            // 🔥 ADD THESE TWO (MANDATORY FIX)
            userId: populated.user.userId,        // numeric userId
            userObjectId: populated.user._id,     // ObjectId for JWT

            ...populated,
            user: undefined,

            image: user.image
                ? `${process.env.API_URL}/uploads/users/${user.image}`
                : null
        }
    };
};


export const updateRecipientService = async (userId, updates, file) => {
    const userUpdates = {};
    const recipientUpdates = {};

    const userFields = ["name", "email", "phone", "gender", "age"];
    const recipientFields = [
        "salary", "shift", "time", "address",
        "emergencyContact", "aadharNumber", "panNumber", "note", "status"
    ];

    for (const key in updates) {
        if (userFields.includes(key)) {
            userUpdates[key] = updates[key];
        } else if (recipientFields.includes(key)) {
            recipientUpdates[key] = updates[key];
        }
    }

    if (file) {
        userUpdates.image = file.filename;
    }

    // 1️⃣ Update User
    const user = await User.findOneAndUpdate(
        { userId, role: "recipient" },
        { $set: userUpdates },
        { new: true }
    ).select("-password -refreshToken -__v");

    if (!user) throw new Error("Recipient not found");

    // 2️⃣ Update Recipient Profile
    const recipient = await Recipient.findOneAndUpdate(
        { user: user._id },
        { $set: recipientUpdates },
        { new: true }
    ).lean();

    return {
        message: "Recipient updated successfully",
        recipient: {
            recipientId: recipient._id,
            ...recipient,
            ...user.toObject(),
            image: user.image
                ? `${process.env.API_URL}/uploads/users/${user.image}`
                : null
        }
    };
};

export const deleteRecipientService = async (userId) => {
    const user = await User.findOne({ userId, role: "recipient" });

    if (!user) throw new Error("Recipient not found");

    await Recipient.findOneAndDelete({ user: user._id });
    await User.findOneAndDelete({ _id: user._id });

    return { message: "Recipient deleted successfully" };
};
