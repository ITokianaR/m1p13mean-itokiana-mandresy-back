import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";

export const addReview = async (input) => {
    if (!input.userId || !input.shopId || !input.rating || !input.comment) {
        const error = new Error("All fields are required");
        error.status = 400;
        throw error;
    }

    const userId = input.userId;
    const shopId = input.shopId;
    const rating = input.rating;
    const comment = input.comment;

    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
        const error = new Error("Shop not found");
        error.status = 404;
        throw error;
    }

    const review = await Review.create({
        user: user,
        shop: shop,
        rating,
        comment
    });

    return review;
};

export const getReviewsByShop = async (shopId) => {
    if (!shopId) {
        const error = new Error("Shop ID is required");
        error.status = 400;
        throw error;
    }
    const reviews = await Review.find({ shop: shopId }).populate('user', 'username');
    return reviews;
}