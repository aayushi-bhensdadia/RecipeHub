import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import spoonRoutes from './spoon.routes.js';
import dishRoutes from './dish.routes.js';
import recipeRoutes from './recipe.routes.js';
import reviewRoutes from './review.routes.js';
import collectionRoutes from './collection.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, service: 'RecipeHub API' }));

router.use('/auth', authRoutes);
router.use('/', userRoutes);              // /me, /my/recipes
router.use('/spoon', spoonRoutes);
router.use('/dishes', dishRoutes);
router.use('/recipes', recipeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/collections', collectionRoutes);

export default router;
