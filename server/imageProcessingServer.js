const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/output', express.static(path.join(__dirname, 'output')));

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('Upload endpoint hit');
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  const inputFilePath = path.join(__dirname, 'uploads', req.file.filename);
  const outputDir = path.join(__dirname, 'output');

  console.log(`Input File Path: ${inputFilePath}`);
  console.log(`Output Directory: ${outputDir}`);

  // Execute Python script for image processing
  exec(`venv/bin/python components/ImageProcessing/extract_shapes.py ${inputFilePath} ${outputDir}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send(`Error processing image: ${stderr}`);
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);

    res.status(200).send({
      message: 'Image uploaded and processed successfully.',
      inputFilePath,
      outputDir,
    });
  });
});

// Endpoint to retrieve processed images
app.get('/processed-images', (req, res) => {
  const outputDir = path.join(__dirname, 'output');

  fs.readdir(outputDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving processed images.');
    }

    const fileUrls = files.map(file => `/output/${file}`);
    res.json(fileUrls);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});