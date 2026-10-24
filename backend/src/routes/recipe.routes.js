import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getRecipe,
  getRecipeImage,
  createRecipe,
  updateRecipe,
  patchRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/:id', asyncHandler(getRecipe));
router.get('/:id/image', asyncHandler(getRecipeImage));
router.post('/', auth, asyncHandler(createRecipe));
router.put('/:id', auth, asyncHandler(updateRecipe));
router.patch('/:id', auth, asyncHandler(patchRecipe));
router.delete('/:id', auth, asyncHandler(deleteRecipe));

export default router;
