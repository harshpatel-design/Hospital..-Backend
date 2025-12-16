import multer from "multer";
import path from "path";
import fs from "fs";

// =============== CREATE FOLDER IF NOT EXISTS ===================
const uploadPath = "uploads/patient-documents";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// =============== MULTER STORAGE ===================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
    }
});

// =============== FILTER FILE TYPES ===================
const fileFilter = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, and PDF files allowed!"), false);
    }
};

// =============== EXPORT MULTIPLE FILE UPLOAD ===================
export const uploadDocuments = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB each file
});
