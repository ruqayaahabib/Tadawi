const express = require("express")
const router = express.Router()
const Hospital = require("../models/Hospital")
const Department = require("../models/Department")

// Displat all hospitals
router.get("/", async(req,res)=>{
    const allHospital = await Hospital.find()
    res.render("hospital/all-hospital.ejs", {hospitals :allHospital})
})

// Display details of one hospital 
router.get('/:hospitalId', async (req,res)=>{
    const foundHospital = await Hospital.findById(req.params.hospitalId)
    const foundDepartment = await Department.find({hospital: req.params.hospitalId})

    res.render("hospital/hospital-details.ejs", {hospital: foundHospital, departments: foundDepartment})
})


module.exports = router