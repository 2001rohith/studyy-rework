const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Unique file name with timestamp
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'video/mp4'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Only PDF and mp4 files are allowed.");
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 },  // 5MB file size limit
  fileFilter: fileFilter
});

module.exports = { upload };
