import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  priceAtAdd: {
    type: Number,
    required: true
  }
});

// 🆕 Sous-schéma billet d'événement
const ticketItemSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  priceAtAdd: {
    type: Number,
    required: true
  },
  ticketDate: { type: Date },
  ticketType: { type: String, default: 'standard' }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items:       [cartItemSchema],
  ticketItems: [ticketItemSchema]  // 🆕
}, { timestamps: true });

// Méthode virtuelle : total produits + billets
cartSchema.virtual('total').get(function () {
  const totalProduits = this.items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity, 0
  );
  const totalBillets = this.ticketItems.reduce(  // 🆕
    (sum, item) => sum + item.priceAtAdd * item.quantity, 0
  );
  return totalProduits + totalBillets;
});

cartSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Cart', cartSchema);