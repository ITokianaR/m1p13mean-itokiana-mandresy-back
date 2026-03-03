import express      from 'express';
import verifyToken  from '../middlewares/verifyToken.js';
import {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  addTicketToCart, updateTicketItem, removeTicketFromCart
} from '../services/cart_service.js';

const router = express.Router();
router.use(verifyToken);

// ─── Produits ─────────────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await addToCart(req.user.id, productId, quantity);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.put('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await updateCartItem(req.user.id, productId, quantity);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.delete('/remove/:productId', async (req, res) => {
  try {
    const cart = await removeFromCart(req.user.id, req.params.productId);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.delete('/clear', async (req, res) => {
  try {
    await clearCart(req.user.id);
    res.json({ message: 'Panier vide' });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

// ─── Billets ──────────────────────────────────────────────────────────────────

router.post('/tickets/add', async (req, res) => {
  try {
    const { eventId, quantity, ticketDate, ticketType } = req.body;
    const cart = await addTicketToCart(
      req.user.id, eventId, quantity, ticketDate, ticketType
    );
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.put('/tickets/update', async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const cart = await updateTicketItem(req.user.id, eventId, quantity);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

router.delete('/tickets/remove/:eventId', async (req, res) => {
  try {
    const cart = await removeTicketFromCart(req.user.id, req.params.eventId);
    res.json({ cart });
  } catch (e) { res.status(e.status || 500).json({ message: e.message }); }
});

export default router;