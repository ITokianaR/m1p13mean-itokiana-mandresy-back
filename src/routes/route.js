import { Router } from 'express';
import userRoute from './userRoute.js';
import AuthController from '../controllers/auth.controller.js';
import shopController from '../controllers/shop.controller.js';
import EventController from '../controllers/event.controller.js';
import ReviewController from '../controllers/review.controller.js';

const router = Router();

router.use('/auth', AuthController);
router.use('/shops', shopController);
router.use('/events', EventController);
router.use('/reviews', ReviewController);
router.use('/users', userRoute);

export default router;