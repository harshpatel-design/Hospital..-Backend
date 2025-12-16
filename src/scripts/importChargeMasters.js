import fs from "fs";
import csv from "csv-parser";
import ChargeMaster from "../models/chargeMaster.model.js";
import mongoose from "mongoose";

export default async function importChargeMasters() {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream("src/data/charge_master.csv")
      .pipe(csv())
      .on("data", (row) => {
        // REQUIRED FIELDS CHECK
        if (!row.name || !row.code || !row.chargeType || !row.amount) return;

        rows.push({
          name: row.name.trim(),
          code: row.code.trim().toUpperCase(),
          chargeType: row.chargeType.toUpperCase(),
          amount: Number(row.amount),
          currency: row.currency || "INR",

          // GST
          gstApplicable: row.gstApplicable === "true",
          gstRate: Number(row.gstRate || 0),
          gstType: row.gstType || "CGST_SGST",
          hsnCode: row.hsnCode || undefined,
          taxInclusive: row.taxInclusive === "true",

          // OPTIONAL REFERENCES
          labTest: mongoose.Types.ObjectId.isValid(row.labTest)
            ? row.labTest
            : null,

          doctor: mongoose.Types.ObjectId.isValid(row.doctor)
            ? row.doctor
            : null,

          department: mongoose.Types.ObjectId.isValid(row.department)
            ? row.department
            : null,

          effectiveFrom: row.effectiveFrom
            ? new Date(row.effectiveFrom)
            : new Date(),

          effectiveTo: row.effectiveTo
            ? new Date(row.effectiveTo)
            : null,

          isActive: row.isActive !== "false",
        });
      })
      .on("end", async () => {
        try {
          if (!rows.length) {
            console.log("⚠️ No valid charge master rows found");
            return resolve();
          }

          await ChargeMaster.insertMany(rows, { ordered: false });
          console.log(`✅ Imported ${rows.length} charge masters`);
          resolve();
        } catch (err) {
          if (err.code === 11000) {
            console.log("⚠️ Duplicate charge masters skipped");
            resolve();
          } else {
            reject(err);
          }
        }
      })
      .on("error", reject);
  });
}
