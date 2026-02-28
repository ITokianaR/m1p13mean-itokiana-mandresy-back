import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";
import {
    addReview,
    getReviewsByShop,
} from '../services/review.service.js';

const router = Router();

// POST /api/reviews/add
router.post(
    "/add",
    verifyToken,
    authorizeRoles("client"),
    async (req, res, next) => {
        try {
            const review = await addReview(req.body);
            res.status(201).json({ review }); 
        } catch (error) {
            next(error);    
        }
    }
);

router.get(
    "/:shopId",
    async (req, res, next) => {
        try {
            const reviews = await getReviewsByShop(req.params.shopId);
            res.status(200).json({ reviews });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
             