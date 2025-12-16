import { resetPasswordService } from "../services/resetpassword.service.js";

export const resetPasswordController = async (req, res) => {
    try {
        const { token, password } = req.body;

        // 1️⃣ Validate token
        if (!token || typeof token !== "string" || token.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Reset token is required",
            });
        }

        // 2️⃣ Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // 3️⃣ Call service
        const result = await resetPasswordService(token, password);

        return res.status(200).json({
            success: true,
            message: result.message || "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
