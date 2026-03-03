import Order   from '../models/order_model.js';
import Cart    from '../models/cart_model.js';
import Product from '../models/product.model.js';

// ─── CRÉER une commande depuis le panier ──────────────────────────────────
export const createOrder = async (userId, note = '') => {
  // Récupérer le panier avec les détails produits
  const cart = await Cart.findOne({ user: userId })
    .populate('items.product')
    .populate('items.shop');

  if (!cart || cart.items.length === 0) {
    const error = new Error('Votre panier est vide');
    error.status = 400;
    throw error;
  }

  // Vérifier les stocks et construire les items de commande
  const orderItems = [];
  let   totalAmount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product) {
      const error = new Error(`Produit "${item.product.name}" introuvable`);
      error.status = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(
        `Stock insuffisant pour "${product.name}" (${product.stock} disponible(s))`
      );
      error.status = 400;
      throw error;
    }

    orderItems.push({
      product:      product._id,
      shop:         item.shop._id,
      quantity:     item.quantity,
      priceAtOrder: item.priceAtAdd,
      productName:  product.name
    });

    totalAmount += item.priceAtAdd * item.quantity;

    // Décrémenter le stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Créer la commande
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    note,
    status: 'pending'
  });

  // Vider le panier après commande
  cart.items = [];
  await cart.save();

  // Retourner la commande populée
  return await Order.findById(order._id)
    .populate('items.product', 'name image')
    .populate('items.shop',    'name location')
    .populate('user',          'username email');
};

// ─── GET commandes d'un utilisateur ───────────────────────────────────────
export const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('items.product', 'name image')
    .populate('items.shop',    'name location logo')
    .sort({ createdAt: -1 }); // plus récentes en premier

  return orders;
};

// ─── GET une commande par ID ───────────────────────────────────────────────
export const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate('items.product', 'name image price')
    .populate('items.shop',    'name location logo')
    .populate('user',          'username email');

  if (!order) {
    const error = new Error('Commande introuvable');
    error.status = 404;
    throw error;
  }

  // Vérifier que la commande appartient à l'utilisateur (sauf admin)
  if (order.user._id.toString() !== userId.toString()) {
    const error = new Error('Accès non autorisé');
    error.status = 403;
    throw error;
  }

  return order;
};

// ─── GET toutes les commandes (admin) ─────────────────────────────────────
export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate('items.product', 'name image')
    .populate('items.shop',    'name')
    .populate('user',          'username email')
    .sort({ createdAt: -1 });

  return orders;
};

// ─── METTRE À JOUR le statut (admin) ──────────────────────────────────────
export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    const error = new Error('Statut invalide');
    error.status = 400;
    throw error;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
    .populate('items.product', 'name image')
    .populate('items.shop',    'name')
    .populate('user',          'username email');

  if (!order) {
    const error = new Error('Commande introuvable');
    error.status = 404;
    throw error;
  }

  return order;
};