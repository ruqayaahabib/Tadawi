const express = require("express")
const router =express.Router()
const Department = require("../models/Department")
const User = require("../models/User")

// Display department details with doctors 
router.get("/:departmentId", async(req,res)=>{
    const foundDepartment = await Department.findById(req.params.departmentId)

    const allDoctor = await User.find({
        role: "doctor",
        department: req.params.departmentId
    })

    res.render("departments.ejs", {department : foundDepartment, doctors: allDoctor})
})

module.exports = router