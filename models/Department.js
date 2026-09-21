const mongoose = require ("mongoose")
const Hospital = require("./Hospital")

const departmentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    hospital:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }

},{timestamps:true})

const Department = mongoose.model("Department", departmentSchema )

module.exports= Department