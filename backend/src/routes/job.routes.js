import express from 'express';
import { createJobDescription, getMyJobs, analyzeATSMatch } from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createJobDescription);
router.get('/', getMyJobs);
router.post('/analyze', analyzeATSMatch);

export default router;
