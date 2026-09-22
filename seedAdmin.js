const connectToDB = require('./db.js')
const User = require("./models/User")
const bcrypt = require('bcrypt')
require('dotenv').config()
async function seed(){
    await connectToDB()
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    await User.create({
        username:'Dr. Rasha Fuad',
        password: hashedPassword,
        role:'doctor',
        department:'6ab255600f8adfe2a3a71bc5',
        hospital: '6ab254be0f8adfe2a3a71bc4'
    })
}
seed()