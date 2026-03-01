import authorizeRoles from "../middlewares/authorizeRole.js";
import verifyToken from "../middlewares/verifyToken.js";
import { addProduct, addCategory } from "../services/product.service.js";
import { Router } from "express";

const router = Router();

router.post(
    "/add",
    verifyToken,
    authorizeRoles("admin", "shop"),
    async (req, res, next) => {
        try {
            const product = await addProduct(req);
            res.status(201).json({ product })
        } catch (error) {
            next(error)
        }
    }
)

router.post(
    "/category/add",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const category = await addCategory(req.body);
            res.status(201).json({ category });
        } catch (error) {
            next(error);
        }
    }
);

export default router;