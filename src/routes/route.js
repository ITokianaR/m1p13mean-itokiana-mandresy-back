import { Router } from 'express';
import userRoute from './userRoute.js';
import AuthController from '../controllers/auth.controller.js';
import shopController from '../controllers/shop.controller.js';

const router = Router();

router.use('/auth', AuthController);
router.use('/shops', shopController);
router.use('/users', userRoute);

export default router;