import fs from "fs";
import csv from "csv-parser";
import ServiceName from "../models/serviceName.model.js";

export default async function importServices() {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream("src/data/service_names.csv")
            .pipe(csv())
            .on("data", (row) => {
                const name = row.ServiceName;
                if (!name) return;
                rows.push({ name: name.trim() });
            })
            .on("end", async () => {
                try {
                    if (rows.length === 0) {
                        console.log("⚠️ No services found in CSV");
                        return resolve();
                    }

                    const result = await ServiceName.insertMany(rows, {
                        ordered: false,
                        rawResult: true
                    });

                    const insertedCount = result.insertedCount || result.acknowledged?.length || 0;
                    const duplicateCount = rows.length - insertedCount;

                    if (duplicateCount > 0) {
                        console.log(`⚠️ Skipped ${duplicateCount} duplicate services`);
                    }
                    console.log(`✅ Successfully imported ${insertedCount} services`);
                    resolve(insertedCount);
                } catch (err) {
                    if (err.code === 11000) {
                        console.log("⚠️ Duplicate services skipped");
                        resolve();
                    } else {
                        reject(err);
                    }
                }
            })
            .on("error", reject);
    });
}
