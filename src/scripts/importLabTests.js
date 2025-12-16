import fs from "fs";
import csv from "csv-parser";
import LabTest from "../models/labTest.model.js";
import User from "../models/user.model.js";

export default async function importLabTests() {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) throw new Error("Admin user not found");

    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream("src/data/lab_tests_master_extended.csv")
            .pipe(csv())
            .on("data", (row) => {
                if (!row.name || !row.code) return;

                rows.push({
                    name: row.name.trim(),
                    code: row.code.trim().toUpperCase(),
                    category: row.category,
                    unit: row.unit || null,
                    normalRange: row.normalRange || null,
                    sampleType: row.sampleType || "Blood",
                    turnaroundTime: Number(row.turnaroundTime) || 24,
                    isActive: true,
                    createdBy: adminUser._id,
                });
            })
            .on("end", async () => {
                try {
                    await LabTest.insertMany(rows, { ordered: false });
                    console.log(`✅ Imported ${rows.length} lab tests`);
                    resolve();
                } catch {
                    console.log("⚠️ Lab test duplicates skipped");
                    resolve();
                }
            })
            .on("error", reject);
    });
}
