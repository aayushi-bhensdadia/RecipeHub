import { Router } from 'express';
import { listDishes, getDish } from '../controllers/dish.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listDishes));
router.get('/:key', asyncHandler(getDish));

export default router;
