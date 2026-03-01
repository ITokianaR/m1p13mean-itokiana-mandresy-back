import mongoose from "mongoose";

const eventCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

const ProductCategory = mongoose.model('ProductCategory', eventCategorySchema);

export default ProductCategory;