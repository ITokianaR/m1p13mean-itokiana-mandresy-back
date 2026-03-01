import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    image: { 
        type: String
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    isLiked: { type : Boolean, default: false},
    isOrdered: {type : Boolean, default: false},
    createdAt: { type : Date, default: Date.now },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    category : { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true} 
})

const Product = mongoose.model("Product", schema)

export default Product