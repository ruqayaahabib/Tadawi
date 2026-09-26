const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
   role:{
    type: String, 
    enum: ["patient", "doctor", "admin"],
    default: "patient"
  },
  department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  hospital:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  imageUrl:{
        type:String
    }

}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
