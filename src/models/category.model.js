import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: {
        type: String,
        default: "🌐",
        maxlength: 4
    },
    createdAt: { type: Date, default: Date.now },
})

const Category = mongoose.model("Category", categorySchema);

export default Category;