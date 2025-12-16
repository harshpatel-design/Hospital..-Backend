import multer from "multer";
import path from "path";
import fs from "fs";

// Create folder if not exist
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/users"; // default folder

    // 🟢 If route contains "patients" → save in uploads/patients
    if (req.baseUrl && req.baseUrl.includes("patients")) {
      folder = "uploads/patients";
    }

    ensureFolder(folder);
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "_" + file.fieldname + ext;
    cb(null, uniqueName);
  }
});

export const uploadUserPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});
