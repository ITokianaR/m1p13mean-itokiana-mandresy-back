import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

router.use(AuthController);

export default router;