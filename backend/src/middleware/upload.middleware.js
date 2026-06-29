import multer from 'multer';

// Use memory storage so we can parse the PDF buffer and stream to Cloudinary without writing to disk
const storage = multer.memoryStorage();

// Accept only PDFs for now
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload a PDF.'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});
