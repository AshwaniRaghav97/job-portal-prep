import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.resolve('uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanExt = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${cleanExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext) || file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOC/DOCX files are supported!'), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});
