import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

// If you want, you can still use sendSuccess later,
// but for now we use plain res.json to keep it simple.
// import { sendSuccess, sendError } from "../utils/responses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSpecializations = (req, res) => {
  try {
    // Excel is in: src/doctor_specializations.xlsx
    // Controller is in: src/controllers/...
    // So go ONE LEVEL UP from controllers → src
    const filePath = path.join(__dirname, "..", "doctor_specializations.xlsx");

    console.log("📄 Excel path:", filePath);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Simple response
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("❌ Excel read error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
