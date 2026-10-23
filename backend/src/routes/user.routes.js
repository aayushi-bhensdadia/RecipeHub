import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getMe } from '../controllers/user.controller.js';
import { getMyRecipes } from '../controllers/recipe.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/me', auth, asyncHandler(getMe));
router.get('/my/recipes', auth, asyncHandler(getMyRecipes));

export default router;
