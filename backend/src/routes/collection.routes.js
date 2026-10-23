import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listCollections, toggleCollection } from '../controllers/collection.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', auth, asyncHandler(listCollections));
router.post('/:kind', auth, asyncHandler(toggleCollection));

export default router;
