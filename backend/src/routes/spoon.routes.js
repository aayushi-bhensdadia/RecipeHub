import { Router } from 'express';
import { search, popular, getRecipe } from '../controllers/spoon.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/search', asyncHandler(search));
router.get('/popular', asyncHandler(popular));
router.get('/recipe/:id', asyncHandler(getRecipe));

export default router;
