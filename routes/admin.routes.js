const express = require("express")
const router = express.Router()
const isAdmin = require("../middleware/is-admin")

const Hospital = require("../models/Hospital")
const Department = require("../models/Department")
const User = require("../models/User")
const Appointment = require("../models/Appointment")
const bcrypt = require('bcrypt')
const upload = require('../middleware/photo-upload')
const isSignedIn = require("../middleware/is-signed-in")

router.get("/", isSignedIn, isAdmin, async(req,res)=>{
    const totalHospitals = await Hospital.countDocuments()
    const totalDepartments = await Department.countDocuments()
    const totalDoctors = await User.countDocuments({role: "doctor"})
    const totalAppointments = await Appointment.countDocuments()

    const totalPatients = await User.countDocuments({role: "patient"})
    const totalAdmins = await User.countDocuments({role: "admin"})

    res.render("admin/admin-dash.ejs", {totalHospitals,totalDepartments,totalDoctors, totalAppointments, totalPatients, totalAdmins})
})

// Display all hospitals 
router.get("/hospitals",isSignedIn, isAdmin,async(req,res)=>{
    const allHospital = await Hospital.find()
    const message = req.session.message
    req.session.message= null
    res.render("admin/manage-all-hospital.ejs", {hospitals: allHospital, message: message})
} )


// Create a new hospital 
router.get("/hospitals/new",isSignedIn, isAdmin, async(req,res)=>{
    res.render("admin/create-hospital.ejs")
})


router.post("/hospitals",isSignedIn, isAdmin,upload.single('imageUrl'), async (req,res)=>{
    console.log(req.file)
    const createHospital = await Hospital.create({
        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,
        description: req.body.description,
        latitude: req.body.latitude, 
        longitude: req.body.longitude,
        imageUrl:`/uploads/${req.file.filename}`

    })
    req.session.message="Hospital Added Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/hospitals")})
})

// edit hospital
router.get("/hospitals/:hospitalId/edit",isSignedIn, isAdmin,async(req,res)=>{
    const foundHospital = await Hospital.findById(req.params.hospitalId)
    res.render("admin/edit-hospital.ejs", {hospital: foundHospital})
})


router.put("/hospitals/:hospitalId",isSignedIn, isAdmin, upload.single('imageUrl') ,async(req,res)=>{
    const {name, phone, location, description, latitude ,longitude} = req.body

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    const updateHospital = await Hospital.findByIdAndUpdate(req.params.hospitalId,{
        name, phone, location, description,latitude, longitude ,imageUrl
    })
    req.session.message="Hospital Updated Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/hospitals")})
})

router.get('/departments/get-hospital/:hospital',isSignedIn,isAdmin, async(req,res)=>{
    // find departments belong to  selected hospital
    const foundDepartments = await Department.find({hospital:req.params.hospital}) 
    res.json(foundDepartments) //send back as json 
})

// Delete Hospital
router.delete("/hospitals/:hospitalId",isSignedIn, isAdmin, async (req,res)=>{
    const deleteHospital = await Hospital.findByIdAndDelete(req.params.hospitalId)
    req.session.message = "Hospital Deleted Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/hospitals")})
})




// ------------------------------------------

// Display all Departments 
router.get("/departments",isSignedIn,isAdmin,async(req,res)=>{
    const allDepartment = await Department.find().populate("hospital")
    const message = req.session.message
    req.session.message = null
    res.render("admin/manage-all-departments.ejs", {departments: allDepartment, message: message})
} )


// Create a new department 
router.get("/departments/new",isSignedIn, isAdmin, async(req,res)=>{
    const allHospitals = await Hospital.find()
    res.render("admin/create-department.ejs", {hospitals : allHospitals})
})


router.post("/departments",isSignedIn, isAdmin, async (req,res)=>{
    const createDepartment = await Department.create({
        name: req.body.name,
        description: req.body.description,
        hospital: req.body.hospital

    })
    req.session.message="Department Added Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/departments")})
})

// edit department
router.get("/departments/:departmentId/edit",isSignedIn, isAdmin,async(req,res)=>{
    const foundDepartment = await Department.findById(req.params.departmentId)
    const allHospital = await Hospital.find()

    res.render("admin/edit-department.ejs", {department: foundDepartment, hospitals: allHospital})
})


router.put("/departments/:departmentId",isSignedIn, isAdmin ,async(req,res)=>{
    const {name, description, hospital} = req.body
    const updateDepartment = await Department.findByIdAndUpdate(req.params.departmentId,{
        name, description, hospital
    })

    req.session.message="Department Updated Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/departments")})
})


// Delete department
router.delete("/departments/:departmentId",isSignedIn,isAdmin, async (req,res)=>{
    const deleteDepartment = await Department.findByIdAndDelete(req.params.departmentId)
    req.session.message="Department Deleted Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/departments")})
})


// ------------------------------------------

// Display all Doctors 
router.get("/doctors",isSignedIn, isAdmin,async(req,res)=>{
    const allDoctors = await User.find({role: "doctor"}).populate("department").populate("hospital")
    const message = req.session.message
    req.session.message=null
    res.render("admin/manage-all-doctors.ejs", {doctors: allDoctors, message: message})
} )


// Create a new Doctor 
router.get("/doctors/new",isSignedIn, isAdmin, async(req,res)=>{
    const allDepartments = await Department.find().populate("hospital")
    const allHospital = await Hospital.find()
    res.render("admin/create-doctor.ejs", {departments: allDepartments, hospitals: allHospital})
})


router.post("/doctors",isSignedIn, isAdmin,upload.single('imageUrl'),async (req,res)=>{
    const createDoctor = await User.create({
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        password: bcrypt.hashSync(req.body.password,12),
        role: "doctor",
        department: req.body.department,
        hospital: req.body.hospital,
        imageUrl:`/uploads/${req.file.filename}`

    })
    req.session.message="Doctor Added Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/doctors")})
})

// edit doctor
router.get("/doctors/:doctorId/edit",isSignedIn, isAdmin,async(req,res)=>{
    const foundDoctor = await User.findById(req.params.doctorId)
    const allDepartment = await Department.find().populate("hospital")
    const allHospital = await Hospital.find()
    res.render("admin/edit-doctor.ejs", {doctor: foundDoctor, departments: allDepartment, hospitals: allHospital})
})


router.put("/doctors/:doctorId",isSignedIn, isAdmin, upload.single('imageUrl')  ,async(req,res)=>{
    const {username, email, bio, department, hospital} = req.body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
    const updateDoctor = await User.findByIdAndUpdate(req.params.doctorId,{
        username, email, bio, department, hospital
    })

    req.session.message="Doctor Updated Successfully!"
    req.session.save(() =>{
    res.redirect("/admin/doctors")})
})


// Delete doctor
router.delete("/doctors/:doctorId",isSignedIn,isAdmin, async (req,res)=>{
    const deleteDoctor = await User.findByIdAndDelete(req.params.doctorId)
    req.session.message="Doctor Deleted Successfully!"
    req.session.save(() => {
    res.redirect("/admin/doctors")})
})








module.exports = router;



