import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";

export const resetPasswordService = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw new Error("Missing token or password");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }

    let user = await User.findById(decoded.id);

    if (!user) {
        const doctor = await Doctor.findById(decoded.id);
        if (!doctor) throw new Error("User not found");

        user = await User.findById(doctor.userId);
        if (!user) throw new Error("User not found");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password reset successfully" };
};
