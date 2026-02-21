import mongoose, { Schema } from "mongoose";

const openingPeriodSchema = new Schema({
  open: { type: String, required: true },   // "06:00"
  close: { type: String, required: true }   // "19:00"
}, { _id: false });

const dailyOpeningSchema = new Schema({
  day: { 
    type: Number, 
    required: true,
    min: 0,
    max: 6   // 0 = Sunday, 6 = Saturday
  },
  isOpen: { 
    type: Boolean, 
    default: true 
  },
  label: { 
    type: String, 
    default: null   // ex: "PASS", "HOLIDAY"
  },
  periods: {
    type: [openingPeriodSchema],
    default: []
  }
}, { _id: false });

const locationSchema = new Schema({
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  section: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  }
}, { _id: false });

const defaultOpeningHours = () => ([
  { day: 1, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 2, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 3, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 4, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 5, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 6, isOpen: true, periods: [{ open: "08:00", close: "19:00" }] },
  { day: 0, isOpen: true, periods: [{ open: "08:00", close: "10:30" }] }
]);

const shopSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: locationSchema,
    required: true
 },

  openingHours: {
    type: [dailyOpeningSchema],
    required: true,
    default: defaultOpeningHours,
    validate: {
        validator: v => v.length === 7,
        message: "Opening hours must contain 7 days"
    }
  },

  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },

  logo: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;