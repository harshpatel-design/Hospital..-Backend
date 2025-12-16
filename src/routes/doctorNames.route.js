import express from "express";
import Doctor from "../models/doctor.model.js";

const router = express.Router();

router.get("/doctors/names", async (req, res) => {
    try {
        const { search = "", sort = "asc" } = req.query;

        const doctors = await Doctor.find()
            .populate("user", "name") // ⭐ get name from User collection
            .sort({ "user.name": sort === "desc" ? -1 : 1 });

        const names = doctors.map((d) => ({
            _id: d._id,            // doctor id
            name: d.user?.name,    // doctor name (from User model)
            availability: d.availability || null
        }));

        res.json({
            success: true,
            doctors: names
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to load doctor names",
            error: err.message
        });
    }
});

export default router;
