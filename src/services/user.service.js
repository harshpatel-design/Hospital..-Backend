import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const createUserService = async (data) => {
    const { name, email, password, role, phone, gender, age } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already registered");

    let hashedPassword = null;

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        gender,
        age
    });
    await user.save();
    return user;
};

export const findUserByEmailService = async (email) => {
    return User.findOne({ email });
};
export const findUserByIdService = async (id) => {
    return User.findById(id).select("-password");
};
export const getAllUsersService = async (page, limit, search, ordering) => {
    const skip = (page - 1) * limit;

    // Search filter
    const searchFilter = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { gender: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } }
            ]
        }
        : {};

    // Ordering
    const sortOrder = ordering.startsWith("-") ? -1 : 1;
    const sortField = ordering.replace("-", "");

    // Fetch documents
    const users = await User.find(searchFilter)
        .select("-password -refreshToken -__v ")
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder });

    // Total Count
    const total = await User.countDocuments(searchFilter);

    return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};


export const deleteUserService = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }

    await User.findByIdAndDelete(id);

    return {
        message: "User deleted successfully",
    };
};
