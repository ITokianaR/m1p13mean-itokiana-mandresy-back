import { signUp, signIn }  from '../services/auth.service.js';
import { Router } from 'express';

const router = Router();

router.post(
    '/register', async (req, res, next) => {
        try{
            const userCreated = await signUp(req.body);
            res.json({ userCreated });
        } catch (error) {
            next(error);
        }
    }
);


router.post(
    '/login', async (req, res, next) => {
        try{
            const userLogged = await signIn(req.body);
            res.json({ userLogged })
        } catch (error) {
            next(error)
        }
    }
)


export default router;