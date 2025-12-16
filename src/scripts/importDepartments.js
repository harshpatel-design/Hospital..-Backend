import fs from "fs";
import csv from "csv-parser";
import Department from "../models/department.model.js";

export default async function importDepartments() {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream("src/data/doctor_departments.csv")
            .pipe(csv())
            .on("data", (row) => {
                // 🔥 Flexible column names
                const name =
                    row.name ||
                    row.Department ||
                    row.department;

                if (!name || !name.trim()) return;

                rows.push({
                    name: name.trim(),
                });
            })
            .on("end", async () => {
                try {
                    if (!rows.length) {
                        console.log("⚠️ No departments found in CSV");
                        return resolve();
                    }

                    await Department.insertMany(rows, { ordered: false });
                    console.log(`✅ Imported ${rows.length} departments`);
                    resolve();
                } catch (err) {
                    console.log("⚠️ Department duplicates skipped");
                    resolve(); // do not break import-all
                }
            })
            .on("error", (err) => {
                console.error("❌ Department import failed:", err);
                reject(err);
            });
    });
}
