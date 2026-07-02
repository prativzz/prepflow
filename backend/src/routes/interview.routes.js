import express from 'express';
import { startSession, getNextQuestion, submitAnswer, analyzeInterview, getFeedback, endSessionEarly } from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/start', startSession);
router.get('/:id/next-question', getNextQuestion);
router.post('/:id/answer', submitAnswer);
router.post('/:id/analyze', analyzeInterview);
router.get('/:id/feedback', getFeedback);
router.post('/:id/end-early', endSessionEarly);

export default router;
