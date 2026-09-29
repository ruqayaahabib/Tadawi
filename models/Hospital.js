const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true
    },
    location:{
        type: String
    },
    imageUrl:{
        type:String
    },
    latitude:{
        type: Number
    },
    longitude:{
        type: Number
    },
    description: {
        type: String
    }
}, {timestamps: true})

const Hospital = mongoose.model("Hospital", hospitalSchema)

module.exports= Hospital