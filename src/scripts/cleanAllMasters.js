import mongoose from "mongoose";
import dotenv from "dotenv";

import ServiceName from "../models/serviceName.model.js";
import LabTest from "../models/labTest.model.js";
import Department from "../models/department.model.js";
import Specialization from "../models/specialization.model.js";
import ChargeMaster from "../models/chargeMaster.model.js";
import DoctorDegree from "../models/doctorDegree.model.js"; // ✅ ADD THIS

dotenv.config();

/* ----------------------------------
   ENV VALIDATION
---------------------------------- */
const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
    console.error("❌ MONGO_URL missing in .env");
    process.exit(1);
}

/* ----------------------------------
   CLEAN MASTER DATA
---------------------------------- */
(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        await ServiceName.deleteMany({});
        console.log("🗑 Service names deleted");

        await LabTest.deleteMany({});
        console.log("🗑 Lab tests deleted");

        await Department.deleteMany({});
        console.log("🗑 Departments deleted");

        await Specialization.deleteMany({});
        console.log("🗑 Specializations deleted");

        await DoctorDegree.deleteMany({}); // ✅ ADD THIS
        console.log("🗑 Doctor degrees deleted");

        await ChargeMaster.deleteMany({});
        console.log("🗑 Charge masters deleted");

        console.log("✅ All master data cleaned successfully");
    } catch (err) {
        console.error("❌ Cleanup failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 DB Disconnected");
        process.exit(0);
    }
})();
