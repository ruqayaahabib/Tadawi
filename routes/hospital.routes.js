const express = require("express")
const router = express.Router()
const Hospital = require("../models/Hospital")

// Displat all hospitals
router.get("/", async(req,res)=>{
    const allHospital = await Hospital.find()
    res.render("all-hospital.ejs", {hospitals :allHospital})
})

// Display details of one hospital 
router.get('/:hospitalId', async (req,res)=>{
    const foundHospital = await Hospital.findById(req.params.hospitalId)
    res.render("hospital-details.ejs", {hospital: foundHospital})
})


module.exports = router