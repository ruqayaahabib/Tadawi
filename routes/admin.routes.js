const express = require("express")
const router = express.Router()
const isAdmin = require("../middleware/is-admin")

const Hospital = require("../models/Hospital")
const Department = require("../models/Department")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const upload = require('../middleware/photo-upload')

router.get("/", isAdmin, async(req,res)=>{
    res.render("admin/admin-dash.ejs")
})

// Display all hospitals 
router.get("/hospitals",isAdmin,async(req,res)=>{
    const allHospital = await Hospital.find()
    res.render("admin/manage-all-hospital.ejs", {hospitals: allHospital})
} )


// Create a new hospital 
router.get("/hospitals/new", isAdmin, async(req,res)=>{
    res.render("admin/create-hospital.ejs")
})


router.post("/hospitals", isAdmin,upload.single('imageUrl'), async (req,res)=>{
    console.log(req.file)
    const createHospital = await Hospital.create({
        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,
        imageUrl:`/uploads/${req.file.filename}`

    })
    res.redirect("/admin/hospitals")
})

// edit hospital
router.get("/hospitals/:hospitalId/edit", isAdmin,async(req,res)=>{
    const foundHospital = await Hospital.findById(req.params.hospitalId)
    res.render("admin/edit-hospital.ejs", {hospital: foundHospital})
})


router.put("/hospitals/:hospitalId", isAdmin, upload.single('imageUrl') ,async(req,res)=>{
    const {name, phone, location} = req.body

    const updateHospital = await Hospital.findByIdAndUpdate(req.params.hospitalId,{
        name, phone, location,imageUrl:`/uploads/${req.file.filename}`
    })
    res.redirect("/admin/hospitals")
})


// Delete Hospital
router.delete("/hospitals/:hospitalId",isAdmin, async (req,res)=>{
    const deleteHospital = await Hospital.findByIdAndDelete(req.params.hospitalId)
    res.redirect("/admin/hospitals")
})




// ------------------------------------------

// Display all Departments 
router.get("/departments",isAdmin,async(req,res)=>{
    const allDepartment = await Department.find().populate("hospital")
    res.render("admin/manage-all-departments.ejs", {departments: allDepartment})
} )


// Create a new department 
router.get("/departments/new", isAdmin, async(req,res)=>{
    const allHospitals = await Hospital.find()
    res.render("admin/create-department.ejs", {hospitals : allHospitals})
})


router.post("/departments", isAdmin, async (req,res)=>{
    const createDepartment = await Department.create({
        name: req.body.name,
        description: req.body.description,
        hospital: req.body.hospital

    })
    res.redirect("/admin/departments")
})

// edit department
router.get("/departments/:departmentId/edit", isAdmin,async(req,res)=>{
    const foundDepartment = await Department.findById(req.params.departmentId)
    const allHospital = await Hospital.find()

    res.render("admin/edit-department.ejs", {department: foundDepartment, hospitals: allHospital})
})


router.put("/departments/:departmentId", isAdmin ,async(req,res)=>{
    const {name, description, hospital} = req.body
    const updateDepartment = await Department.findByIdAndUpdate(req.params.departmentId,{
        name, description, hospital
    })

    res.redirect("/admin/departments")
})


// Delete department
router.delete("/departments/:departmentId",isAdmin, async (req,res)=>{
    const deleteDepartment = await Department.findByIdAndDelete(req.params.departmentId)
    res.redirect("/admin/departments")
})


// ------------------------------------------

// Display all Doctors 
router.get("/doctors",isAdmin,async(req,res)=>{
    const allDoctors = await User.find({role: "doctor"}).populate("department").populate("hospital")
    res.render("admin/manage-all-doctors.ejs", {doctors: allDoctors})
} )


// Create a new Doctor 
router.get("/doctors/new", isAdmin, async(req,res)=>{
    const allDepartments = await Department.find()
    const allHospital = await Hospital.find()
    res.render("admin/create-doctor.ejs", {departments: allDepartments, hospitals: allHospital})
})


router.post("/doctors", isAdmin,upload.single('imageUrl'),async (req,res)=>{
    const createDoctor = await User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,12),
        role: "doctor",
        department: req.body.department,
        hospital: req.body.hospital,
        imageUrl:`/uploads/${req.file.filename}`

    })
    res.redirect("/admin/doctors")
})

// edit doctor
router.get("/doctors/:doctorId/edit", isAdmin,async(req,res)=>{
    const foundDoctor = await User.findById(req.params.doctorId)
    const allDepartment = await Department.find()
    const allHospital = await Hospital.find()
    res.render("admin/edit-doctor.ejs", {doctor: foundDoctor, departments: allDepartment, hospitals: allHospital})
})


router.put("/doctors/:doctorId", isAdmin, upload.single('imageUrl')  ,async(req,res)=>{
    const {username, department, hospital} = req.body
    const updateDoctor = await User.findByIdAndUpdate(req.params.doctorId,{
        username, department, hospital, imageUrl:`/uploads/${req.file.filename}`
    })

    res.redirect("/admin/doctors")
})


// Delete doctor
router.delete("/doctors/:doctorId",isAdmin, async (req,res)=>{
    const deleteDoctor = await User.findByIdAndDelete(req.params.doctorId)
    res.redirect("/admin/doctors")
})








module.exports = router;



