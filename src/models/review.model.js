import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true},
    rating: {type: Number, min: 1, max: 5},
    comment: {type: String, required: true}
})

const Review = mongoose.model("Review", reviewSchema);

export default Review;