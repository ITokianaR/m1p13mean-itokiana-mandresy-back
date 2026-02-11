import mongoose, {Schema} from "mongoose";

const promotionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true},
    discountPercentage: {type: Number, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    isActive: {type: Boolean, required: true}
})

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;