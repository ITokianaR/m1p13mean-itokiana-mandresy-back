import { Router } from 'express';
import {
    addEvent,
    updateEvent,
    getAllEvents,
    getEventById,
    deleteEvent,
    addEventCategory,
    updateEventCategory,
    deleteEventCategory
} from '../services/event.service.js';
import EventCategory from '../models/eventcategory.model.js';
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";

const router = Router();

// ── GET tous les événements (public) ─────────────────────────────
router.get("/", async (req, res, next) => {
    try {
        const events = await getAllEvents();
        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
});

// ── GET toutes les catégories (public) ────────────────────────────
router.get("/category/all", async (req, res, next) => {
    try {
        const categories = await EventCategory.find();
        res.status(200).json({ categories });
    } catch (error) {
        next(error);
    }
});

// ── GET un événement par ID (public) ─────────────────────────────
router.get("/:eventId", async (req, res, next) => {
    try {
        const event = await getEventById(req.params.eventId);
        res.status(200).json({ event });
    } catch (error) {
        next(error);
    }
});

// ── POST créer un événement (admin) ──────────────────────────────
router.post(
    "/add",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const event = await addEvent(req);
            res.status(201).json({ event });
        } catch (error) {
            next(error);
        }
    }
);

// ── PUT modifier un événement (admin) ────────────────────────────
router.put(
    "/:eventId",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const updatedEvent = await updateEvent(req.params.eventId, req);
            res.status(200).json({ event: updatedEvent });
        } catch (error) {
            next(error);
        }
    }
);

// ── DELETE supprimer un événement (admin) ─────────────────────────
router.delete(
    "/:eventId",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const event = await deleteEvent(req.params.eventId);
            res.status(200).json({ event });
        } catch (error) {
            next(error);
        }
    }
);

// ── POST créer une catégorie (admin) ──────────────────────────────
router.post(
    "/category/add",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const category = await addEventCategory(req.body);
            res.status(201).json({ category });
        } catch (error) {
            next(error);
        }
    }
);

// ── PUT modifier une catégorie (admin) ────────────────────────────
router.put(
    "/category/:categoryId",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const updatedCategory = await updateEventCategory(req.params.categoryId, req.body);
            res.status(200).json({ category: updatedCategory });
        } catch (error) {
            next(error);
        }
    }
);

// ── DELETE supprimer une catégorie (admin) ────────────────────────
router.delete(
    "/category/:categoryId",
    verifyToken,
    authorizeRoles("admin"),
    async (req, res, next) => {
        try {
            const category = await deleteEventCategory(req.params.categoryId);
            res.status(200).json({ category });
        } catch (error) {
            next(error);
        }
    }
);

export default router;