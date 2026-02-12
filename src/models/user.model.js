import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop: {
        type : Schema.Types.ObjectId,
        ref: 'Shop'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    role: { 
        type: String, 
        enum: ['client', 'shop', 'admin'], 
        default: 'client'
    },
})

const User = mongoose.model("User", userSchema);

export default User;