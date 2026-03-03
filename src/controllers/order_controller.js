import { Router } from 'express';
import verifyToken    from '../middlewares/verifyToken.js';
import authorizeRoles from '../middlewares/authorizeRole.js';
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../services/order_service.js';

const router = Router();

router.use(verifyToken);

// POST /api/orders/create — passer une commande
router.post('/create', async (req, res, next) => {
  try {
    const { note } = req.body;
    const order = await createOrder(req.user.id, note);
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my — mes commandes
router.get('/my', async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:orderId — détail d'une commande
router.get('/:orderId', async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.orderId, req.user.id);
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders — toutes les commandes (admin)
router.get(
  '/',
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      const orders = await getAllOrders();
      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/orders/:orderId/status — changer le statut (admin)
router.put(
  '/:orderId/status',
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await updateOrderStatus(req.params.orderId, status);
      res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }
);

export default router;