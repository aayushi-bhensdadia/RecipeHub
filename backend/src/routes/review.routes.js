import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listReviews, saveReview, deleteReview } from '../controllers/review.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/:rid', asyncHandler(listReviews));
router.post('/:rid', auth, asyncHandler(saveReview));
router.delete('/:rid', auth, asyncHandler(deleteReview));

export default router;
