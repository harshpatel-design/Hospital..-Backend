import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import labTechnicianRoutes from "./routes/labTechnician.routes.js";
import specializationRoutes from "./routes/specialization.routes.js";
import recipientRoutes from "./routes/recipient.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import degreesRoute from "./routes/degree.route.js";
import doctorNamesRoute from "./routes/doctorNames.route.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import serviceNameRoutes from "./routes/serviceNames.routes.js";
import serviceRoutes from './routes/service.routes.js';
import labTestRoutes from './routes/labTest.routes.js';
import roomRoutes from './routes/room.routes.js'; 


import floorRoutes from "./routes/floor.routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("uploads/users")) fs.mkdirSync("uploads/users");
if (!fs.existsSync("uploads/patients")) fs.mkdirSync("uploads/patients");
if (!fs.existsSync("uploads/appointments")) fs.mkdirSync("uploads/appointments");

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
    })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads/users", express.static(path.join(process.cwd(), "uploads/users")));
app.use("/uploads/patients", express.static(path.join(process.cwd(), "uploads/patients")));
app.use("/uploads/appointments", express.static(path.join(process.cwd(), "uploads/appointments")));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/lab-technicians", labTechnicianRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api", specializationRoutes);
app.use("/api", departmentRoutes);
app.use("/api", degreesRoute);
app.use("/api", doctorNamesRoute);
app.use("/api/servicenames", serviceNameRoutes);
app.use("/api", labTestRoutes);
app.use("/api", floorRoutes);
app.use("/api", roomRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.use(errorHandler);

const folder = path.join(__dirname, "uploads/users");

fs.readdirSync(folder).forEach((file) => {
    if (!file.includes(".")) {
        fs.renameSync(path.join(folder, file), path.join(folder, file + ".png"));
    }
});

const start = async () => {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => logger.info(`🚀 Server running at port ${PORT}`));
};

start();
