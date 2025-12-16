import express from "express";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

const router = express.Router();

router.get("/departments", (req, res) => {
    const { search = "", sort = "asc" } = req.query;

    const filePath = path.join(process.cwd(), "src", "data", "doctor_departments.csv");
    const list = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
            list.push(row.Department);
        })
        .on("end", () => {

            // FILTER (SEARCH)
            let filtered = list.filter((d) =>
                d.toLowerCase().includes(search.toLowerCase())
            );

            // SORT
            filtered = filtered.sort((a, b) => {
                if (sort === "desc") return b.localeCompare(a);
                return a.localeCompare(b);
            });

            res.json({
                success: true,
                count: filtered.length,
                departments: filtered,
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
