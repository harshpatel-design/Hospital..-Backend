import fs from "fs";
import csv from "csv-parser";
import Specialization from "../models/specialization.model.js";
import User from "../models/user.model.js";

export default async function importSpecializations() {
    // 🔥 Find admin user safely
    const adminUser = await User.findOne({ role: "admin" }).select("_id");

    if (!adminUser) {
        console.log("⚠️ Admin user not found, skipping specializations import");
        return;
    }

    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream("src/data/doctor_specializations.csv")
            .pipe(csv())
            .on("data", (row) => {
                const name =
                    row.name ||
                    row.Specialization ||
                    row.specialization;

                if (!name || !name.trim()) return;

                rows.push({
                    name: name.trim(),
                    isActive: true,
                    createdBy: adminUser._id,
                });
            })
            .on("end", async () => {
                try {
                    if (!rows.length) {
                        console.log("⚠️ No specializations found in CSV");
                        return resolve();
                    }

                    await Specialization.insertMany(rows, { ordered: false });
                    console.log(`✅ Imported ${rows.length} specializations`);
                    resolve();
                } catch (err) {
                    console.log("⚠️ Specialization duplicates skipped");
                    resolve(); // never fail import-all
                }
            })
            .on("error", (err) => {
                console.error("❌ Specialization import failed:", err);
                reject(err);
            });
    });
}
