import authorizeRoles from "../middlewares/authorizeRole.js";
import verifyToken from "../middlewares/verifyToken.js";
import {
    addProduct,
    addCategory,
    getAllProduct,
    getProductsByShop,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProductCategories
} from "../services/product.service.js";
import { Router } from "express";

const router = Router();

// ✅ GET /api/products/ — tous les produits (public)
router.get(
    "/",
    async (req, res, next) => {
        try {
            const products = await getAllProduct();
            res.status(200).json({ products });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/products/categories — toutes les catégories produits (public)
router.get(
    "/categories",
    async (req, res, next) => {
        try {
            const categories = await getAllProductCategories();
            res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/products/shop/:shopId — produits d'une boutique (public)
router.get(
    "/shop/:shopId",
    async (req, res, next) => {
        try {
            const products = await getProductsByShop(req.params.shopId);
            res.status(200).json({ products });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/products/:id — un produit (public) ⚠️ toujours après les routes nommées
router.get(
    "/:id",
    async (req, res, next) => {
        try {
            const product = await getProductById(req.params.id);
            res.status(200).json({ product });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/products/add — créer un produit (admin / shop)
router.post(
    "/add",
    verifyToken,
    authorizeRoles("admin", "shop"),
    async (req, res, next) => {
        try {
            const product = await addProduct(req);
            res.status(201).json({ product });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/products/categories/add — créer une catégorie produit (admin)
router.post(
    "/categories/add",
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

// PUT /api/products/:id — modifier un produit (admin / shop)
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "shop"),
    async (req, res, next) => {
        try {
            const product = await updateProduct(req.params.id, req);
            res.status(200).json({ product });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE /api/products/:id — supprimer un produit (admin)
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const result = await deleteProduct(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;