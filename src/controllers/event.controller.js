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

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRole.js";

const router = Router();
router.get(
    "/",
    async (req, res, next) => {
        try {
            const { getAllEvents } = await import('../services/event.service.js');
            const events = await getAllEvents();
            res.status(200).json({ events });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:eventId",
    async (req, res, next) => {
        try {
            const { getEventById } = await import('../services/event.service.js');
            const event = await getEventById(req.params.eventId);
            res.status(200).json({ event });
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/add",
    verifyToken,
    authorizeRoles("admin", "shop"),
    async (req, res, next) => {
        try {
            const event = await addEvent(req);
            res.status(201).json({ event });
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    "/:eventId",
    verifyToken,
    authorizeRoles("admin", "shop"),
    async (req, res, next) => {
        try {
            const updatedEvent = await updateEvent(req.params.eventId, req.body);
            res.status(200).json({ event: updatedEvent });
        } catch (error) {
            next(error);
        }
    }
);

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