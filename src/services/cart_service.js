import Cart    from '../models/cart_model.js';
import Product from '../models/product.model.js';
import Event   from '../models/event.model.js';  // 🆕

// ─── Helper populate ──────────────────────────────────────────────────────────
const populateCart = (query) =>
  query
    .populate('items.product', 'name price image stock')
    .populate('items.shop',    'name location logo')
    .populate('ticketItems.event', 'title image eventDateTime price isFree category');  // 🆕

// ─── GET panier de l'utilisateur ──────────────────────────────────────────────
export const getCart = async (userId) => {
  const cart = await populateCart(Cart.findOne({ user: userId }));
  if (!cart) return { items: [], ticketItems: [], total: 0 };
  return cart;
};

// ─── AJOUTER un produit au panier ─────────────────────────────────────────────
export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId).populate('shop');
  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error(`Stock insuffisant (${product.stock} disponible(s))`);
    error.status = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], ticketItems: [] });
  }

  const existingIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingIndex >= 0) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > product.stock) {
      const error = new Error(`Stock insuffisant (${product.stock} disponible(s))`);
      error.status = 400;
      throw error;
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      product:    product._id,
      shop:       product.shop._id,
      quantity,
      priceAtAdd: product.price
    });
  }

  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};

// ─── METTRE À JOUR la quantité d'un article ───────────────────────────────────
export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) {
    const error = new Error('La quantité doit être au moins 1');
    error.status = 400;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error(`Stock insuffisant (${product.stock} disponible(s))`);
    error.status = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Panier introuvable');
    error.status = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex < 0) {
    const error = new Error('Produit non trouvé dans le panier');
    error.status = 404;
    throw error;
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};

// ─── SUPPRIMER un article du panier ───────────────────────────────────────────
export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Panier introuvable');
    error.status = 404;
    throw error;
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};

// ─── VIDER le panier ──────────────────────────────────────────────────────────
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return;

  cart.items       = [];
  cart.ticketItems = [];  // 🆕 vider aussi les billets
  await cart.save();
  return cart;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🆕 BILLETS D'ÉVÉNEMENTS
// ─────────────────────────────────────────────────────────────────────────────

// ─── AJOUTER un billet au panier ──────────────────────────────────────────────
export const addTicketToCart = async (
  userId, eventId, quantity = 1, ticketDate, ticketType = 'standard'
) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('Événement introuvable');
    error.status = 404;
    throw error;
  }

  if (event.isFree || !event.price || event.price <= 0) {
    const error = new Error('Cet événement est gratuit, aucune réservation nécessaire');
    error.status = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], ticketItems: [] });
  }

  const existingIndex = cart.ticketItems.findIndex(
    item => item.event.toString() === eventId
  );

  if (existingIndex >= 0) {
    cart.ticketItems[existingIndex].quantity += quantity;
    if (ticketDate) cart.ticketItems[existingIndex].ticketDate = ticketDate;
    if (ticketType) cart.ticketItems[existingIndex].ticketType = ticketType;
  } else {
    cart.ticketItems.push({
      event:      eventId,
      quantity,
      priceAtAdd: event.price,
      ticketDate: ticketDate || event.eventDateTime,
      ticketType
    });
  }

  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};

// ─── METTRE À JOUR la quantité d'un billet ────────────────────────────────────
export const updateTicketItem = async (userId, eventId, quantity) => {
  if (quantity < 1) {
    const error = new Error('La quantité doit être au moins 1');
    error.status = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Panier introuvable');
    error.status = 404;
    throw error;
  }

  const itemIndex = cart.ticketItems.findIndex(
    item => item.event.toString() === eventId
  );

  if (itemIndex < 0) {
    const error = new Error('Billet non trouvé dans le panier');
    error.status = 404;
    throw error;
  }

  cart.ticketItems[itemIndex].quantity = quantity;
  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};

// ─── SUPPRIMER un billet du panier ────────────────────────────────────────────
export const removeTicketFromCart = async (userId, eventId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Panier introuvable');
    error.status = 404;
    throw error;
  }

  cart.ticketItems = cart.ticketItems.filter(
    item => item.event.toString() !== eventId
  );

  await cart.save();
  return populateCart(Cart.findOne({ user: userId }));
};