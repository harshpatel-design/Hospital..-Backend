import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Add middleware to log all requests
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint is working!',
        timestamp: new Date().toISOString()
    });
});

// Main endpoint
router.get('/', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'service_names.csv');

        if (!fs.existsSync(filePath)) {
            throw new Error('Service data file not found');
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n')
            .filter(line => line.trim() !== '')
            .slice(1) // Skip header
            .map(line => line.trim());

        res.json({
            success: true,
            count: lines.length,
            services: lines
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;