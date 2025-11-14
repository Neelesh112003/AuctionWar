const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define absolute uploads directory path
const uploadDir = path.join(__dirname, '..', 'uploads');

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Use absolute path to uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
