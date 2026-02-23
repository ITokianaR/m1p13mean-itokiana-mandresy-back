import { Router } from 'express';
import { addShop } from '../services/shop.service.js'
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";
import { addCategory,
  getShopList, updateShop, getShopByCategory, getAllCategory, getShopById, updateCategory } 
  from '../services/shop.service.js';

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

router.put(
  "/:shopId",
  verifyToken,
  authorizeRoles("admin", "shop"),
  async (req, res, next) => {
    try {
      const updatedShop = await updateShop(req.params.shopId, req);
      res.status(200).json({ shop: updatedShop });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/category/:categoryId",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const updatedCategory = await updateCategory(req.params.categoryId, req.body);
      res.status(200).json({ category: updatedCategory });
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

router.get(
  "/",
  async (req, res, next) => {
    try {
      const shops = await getShopList();
      res.status(200).json({ shops });
    } catch (error) {
      next(error);
    }
});

router.get(
  "/category",
  async (req, res, next) => {
    try {
      const categories = await getAllCategory();
      res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/category/:categoryId",
  async (req, res, next) => {
    try {
      const shops = await getShopByCategory(req.params.categoryId);
      res.status(200).json({ shops });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:shopId",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      const shop = await deleteShop(req.params.shopId);
      res.status(200).json({ shop });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:shopId",
  async (req, res, next) => {
    try {
      const shop = await getShopById(req.params.shopId);
      res.status(200).json({ shop });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
