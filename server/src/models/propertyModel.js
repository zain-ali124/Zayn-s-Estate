import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    propertyType:{
        type: String,
        required: true,
        enum: [ 'villa', 'house', 'apartment', 'plot']
    },
    bedrooms:{
        type: Number,
    },
    bathrooms:{
        type: Number,
    },
    area:{
        type: Number,
    },
    images:[{
        type: String
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
},
{timestamps: true}
)

export default mongoose.model("Property", propertySchema);