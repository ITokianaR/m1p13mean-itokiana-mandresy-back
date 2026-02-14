import express, { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";

const router = Router();

// admin route
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome admin" });
});

// shop route
router.get("/shop", verifyToken, authorizeRoles("admin", "shop"), (req, res) => {
    res.json({ message: "Welcome shop" });
});

// user route
router.get("/client", verifyToken, authorizeRoles("admin", "client"), (req, res) => {
    res.json({ message: "Welcome client" });
});

export default router;