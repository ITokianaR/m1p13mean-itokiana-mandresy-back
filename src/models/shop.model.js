import mongoose, {Schema} from "mongoose";

const shopSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    location: { type: String, required: true },
    openingHours: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    category: {type : Schema.Types.ObjectId, ref: 'Category', required: true},
    logo: { type: String, required: true },
    coverPhoto: { type: String, required: true },
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;