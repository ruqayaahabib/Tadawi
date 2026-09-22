const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    phone:{
        type: Number,
        require: true
    },
    location:{
        type: String
    },
    imageUrl:{
        type:String
    }
}, {timestamps: true})

const Hospital = mongoose.model("Hospital", hospitalSchema)

module.exports= Hospital