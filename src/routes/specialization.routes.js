import express from "express";
import fs from "fs";
import csv from "csv-parser";

const router = express.Router();

router.get("/specializations", (req, res) => {
    const filePath = "./src/data/doctor_specializations.csv";
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data.Specialization)) // CSV column name
        .on("end", () => {
            res.json({
                success: true,
                count: results.length,
                specializations: results,
            });
        })
        .on("error", (err) => {
            res.status(500).json({
                success: false,
                message: "Error reading CSV file",
                error: err.message,
            });
        });
});

export default router;
