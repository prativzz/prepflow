import express from 'express';
import { uploadResume, getMyResumes } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect); // All resume routes are protected

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getMyResumes);

export default router;
