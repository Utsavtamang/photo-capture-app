const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for external access (optional)
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve frontend files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Multer storage configuration for uploading images
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});
const upload = multer({ storage });

// Ensure "uploads" folder exists
const fs = require('fs');
const uploadDir = path.join(__dirname, './uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploaded images as static files
app.use('/uploads', express.static(uploadDir));

// Upload endpoint (max 25 images)
app.post('/upload', upload.array('photos', 25), (req, res) => {
    res.json({ success: true, files: req.files });
});

// Start server
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running at: http://192.168.254.115:${PORT}`));

