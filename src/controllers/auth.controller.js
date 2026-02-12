import { signUp }  from '../services/auth.service.js';
import { Router } from 'express';

const router = Router();

router.post(
    '/user/signup', async (req, res, next) => {
    try{
        const user = await signUp(req.body);
        res.json({ user });
    } catch (error) {
        next(error);
    }
});

export default router;