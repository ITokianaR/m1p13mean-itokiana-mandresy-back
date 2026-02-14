import { Router } from 'express';
import userRoute from './userRoute.js';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

router.use('/auth', AuthController);
router.use('/users', userRoute);

export default router;