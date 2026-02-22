import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    eventDateTime: { 
        type: Date, 
        required: true 
    },
    shop: { 
        type: Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'EventCategory', 
        required: true 
    },
    image: { 
        type: String 
    },
    price: { 
        type: Number,
        min: 0
    },
    isFree: { 
        type: Boolean, 
        required: true,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;