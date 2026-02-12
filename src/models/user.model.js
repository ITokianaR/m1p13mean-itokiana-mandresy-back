import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true},
    gender: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    shop: {type : Schema.Types.ObjectId, ref: 'Shop'},
    isActive: {type: Boolean},
    role: { 
        type: String, 
        enum: ['client', 'shop', 'admin'], 
        default: 'user'
    },
})

const User = mongoose.model("User", userSchema);

export default User;