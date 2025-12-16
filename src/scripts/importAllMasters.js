import dotenv from "dotenv";
import mongoose from "mongoose";

import importDepartments from "./importDepartments.js";
import importServiceNames from "./importServiceNames.js";
import importSpecializations from "./importSpecializations.js";
import importLabTests from "./importLabTests.js";
import importDoctorDegrees from "./importDoctorDegrees.js";
import importChargeMasters from "./importChargeMasters.js";     

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;
if (!MONGO_URI) {
    console.error("❌ MONGO_URL missing");
    process.exit(1);
}

try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    console.log("🚀 Importing Departments...");
    await importDepartments();

    console.log("🚀 Importing Service Names...");
    await importServiceNames();

    console.log("🚀 Importing Specializations...");
    await importSpecializations();

    console.log("🚀 Importing Doctor Degrees...");
    await importDoctorDegrees();

    console.log("🚀 Importing Lab Tests...");
    await importLabTests();

    console.log("🚀 Importing Charge Masters...");
    await importChargeMasters();

    console.log("🎉 All master data imported successfully");
} catch (err) {
    console.error("❌ Import failed:", err.message);
} finally {
    await mongoose.disconnect();
    console.log("🔌 DB Disconnected");
    process.exit(0);
}
