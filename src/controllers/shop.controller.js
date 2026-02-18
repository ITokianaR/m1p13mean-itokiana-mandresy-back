import { Router } from 'express';
import { addShop } from '../services/shop.service.js'
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";
import { addCategory } from '../services/shop.service.js';

const router = Router()

router.post(
  "/add",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const shop = await addShop(req);
      res.status(201).json({ shop });
    } catch (error) {
      next(error);
    }
  }
);

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
