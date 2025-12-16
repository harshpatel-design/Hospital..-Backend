import express from "express";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

const router = express.Router();

router.get("/degrees", (req, res) => {
  const { search = "", sort = "asc", page, limit } = req.query;

  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "all_doctor_degrees_expanded.csv"
  );

  const list = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const degreeKey = Object.keys(row).find(
        (k) => k && k.toLowerCase() === "degree"
      );
      if (degreeKey && row[degreeKey]) list.push(String(row[degreeKey]).trim());
    })
    .on("end", () => {
      let unique = Array.from(new Set(list.filter((d) => d && d.length)));
      if (search && String(search).trim()) {
        const q = String(search).toLowerCase();
        unique = unique.filter((d) => d.toLowerCase().includes(q));
      }
      unique = unique.sort((a, b) => {
        if (sort === "desc") return b.localeCompare(a);
        return a.localeCompare(b);
      });
      let paged = unique;
      const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : null;
      const lim = limit ? Math.max(1, parseInt(limit, 20) || 20) : null;
      if (pageNum && lim) {
        const start = (pageNum - 1) * lim;
        paged = unique.slice(start, start + lim);
      }

      res.json({
        success: true,
        total: unique.length,
        count: paged.length,
        degrees: paged,
      });
    })
    .on("error", (err) => {
      res.status(500).json({
        success: false,
        message: "Error reading CSV file",
        error: err.message,
      });
    });
});

export default router;
