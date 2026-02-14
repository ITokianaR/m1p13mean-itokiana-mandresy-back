import { signUp, signIn }  from '../services/auth.service.js';
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
    }
);


router.post(
    '/user/signin', async (req, res, next) => {
        try{
            const userLogged = await signIn(req.body);
            res.json({ userLogged })
        } catch (error) {
            next(error)
        }
    }
)


export default router;