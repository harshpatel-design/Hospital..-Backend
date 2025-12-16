import mongoose from "mongoose";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllDoctorsService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    const searchFilter = {
        role: "doctor",
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
        .select("name email phone gender age role userId createdAt image")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);

    const doctors = await Doctor.find({ user: { $in: users.map(u => u._id) } })
        .populate("user", "name email phone gender age role userId createdAt image")
        .lean();

    const mergedDoctors = doctors.map(doc => {
        const userData = doc.user;
        const { user, _id, __v, name, email, phone, gender, age, role, userId, ...doctorFields } = doc;

        return {
            doctorId: _id,
            _id: userData._id,
            ...doctorFields,
            ...userData,
            image: userData.image || doctorFields.image || null
        };
    });

    const total = await Doctor.countDocuments({
        user: { $in: users.map(u => u._id) }
    });
    ;
    return {
        message: "Doctors fetched successfully",
        doctors: mergedDoctors,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};


export const getDoctorByIdService = async (userId) => {
    const user = await User.findOne({ userId, role: "doctor" })
        .select("-password -refreshToken -__v");

    if (!user) {
        throw new Error("Doctor not found");
    }

    const doctorProfile = await Doctor.findOne({ user: user._id })
        .select("-__v")
        .populate('user', '-password -refreshToken -__v')
        .lean();

    if (!doctorProfile) {
        throw new Error("Doctor profile not found");
    }

    // Create the response object
    const response = {
        message: "Doctor fetched successfully",
        doctor: {
            doctorId: doctorProfile._id,
            ...doctorProfile,
            ...(doctorProfile.user || {}),
            user: undefined // Remove the nested user object
        }
    };

    if (doctorProfile.image) {
        response.doctor.image = `${process.env.API_URL || ''}/uploads/users/${doctorProfile.image}`;
    } else if (user.image) {
        response.doctor.image = `${process.env.API_URL || ''}/uploads/users/${user.image}`;
        await Doctor.findByIdAndUpdate(doctorProfile._id, {
            $set: { image: user.image }
        });
    }

    return response;
};

export const createDoctorService = async (data, file) => {
    try {
        const {
            name,
            email,
            phone,
            gender,
            age,
            specialization,
            department,
            experience,
            bio,
            education,
            availability,
        } = data;
        if (await User.findOne({ email })) {
            throw new Error("Email already in use");
        }
        const user = await User.create({
            name,
            email,
            phone,
            gender,
            age,
            role: "doctor",
            password: null,
            image: file ? file.filename : null,
        });

        const doctor = await Doctor.create({
            user: user._id,
            specialization,
            department,
            experience,
            bio,
            education,
            availability
        });

        const token = jwt.sign(
            { id: user._id, purpose: "reset_password" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        const populated = await Doctor.findById(doctor._id)
            .populate("user", "-password -refreshToken -__v")
            .lean();

        return {
            message: "Doctor created successfully",
            doctor: {
                ...populated,
                doctorId: populated._id,
                userId: populated.user._id,
                image: user.image
                    ? `${process.env.API_URL}/uploads/users/${user.image}`
                    : null,
            },
            resetLink,
        };
    } catch (error) {
        throw error;
    }
};

export const updateDoctorService = async (userId, updates, file) => {
    const userUpdates = {};
    const doctorUpdates = {};

    const userFields = ["name", "email", "phone", "gender", "age", "image"];
    const doctorFields = [
        "specialization",
        "department",
        "experience",
        "bio",
        "education",
        "availability",
        "status",
    ];

    for (const key in updates) {
        if (userFields.includes(key)) userUpdates[key] = updates[key];
        else if (doctorFields.includes(key)) doctorUpdates[key] = updates[key];
    }

    if (file) {
        userUpdates.image = file.filename;
    }

    if (updates.password) {
        userUpdates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findOneAndUpdate(
        { userId: userId, role: "doctor" },
        { $set: userUpdates },
        { new: true, runValidators: true }
    ).select("-password -refreshToken -__v");

    if (!user) throw new Error("User not found");

    const doctor = await Doctor.findOneAndUpdate(
        { user: user._id },
        { $set: doctorUpdates },
        { new: true, runValidators: true }
    ).lean();

    if (!doctor) throw new Error("Doctor profile not found");

    return {
        message: "Doctor updated successfully",
        doctor: {
            doctorId: doctor._id,
            ...doctor,
            user: {
                ...user.toObject(),
                image: userUpdates.image
                    ? `${process.env.API_URL}/uploads/users/${userUpdates.image}`
                    : user.image
                        ? `${process.env.API_URL}/uploads/users/${user.image}`
                        : null,
            },
        },
    };
};


export const deleteDoctorService = async (userId) => {
    const user = await User.findOne({ userId, role: "doctor" });
    if (!user) throw new Error("Doctor not found");

    await Doctor.findOneAndDelete({ user: user._id });
    await User.findOneAndDelete({ _id: user._id });
    return { message: "Doctor deleted successfully" };
};

