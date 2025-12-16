import fs from "fs";
import csv from "csv-parser";
import DoctorDegree from "../models/doctorDegree.model.js";
import User from "../models/user.model.js";

export default async function importDoctorDegrees() {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) throw new Error("Admin user not found");

    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream("src/data/all_doctor_degrees_expanded.csv")
            .pipe(csv())
            .on("data", (row) => {
                if (!row.name) return;

                rows.push({
                    name: row.name.trim(),
                    shortName: row.shortName?.trim() || null,
                    level: row.level || "UG",
                    isActive: true,
                    createdBy: adminUser._id,
                });
            })
            .on("end", async () => {
                try {
                    await DoctorDegree.insertMany(rows, { ordered: false });
                    console.log(`✅ Imported ${rows.length} doctor degrees`);
                    resolve();
                } catch {
                    console.log("⚠️ Doctor degree duplicates skipped");
                    resolve();
                }
            })
            .on("error", reject);
    });
}
