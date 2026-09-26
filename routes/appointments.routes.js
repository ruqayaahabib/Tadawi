const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")
const isSignedIn = require("../middleware/is-signed-in")


// Display all patient appointments 
router.get("/", isSignedIn,async(req,res)=>{
    const allAppointment = await Appointment.find({patient: req.session.user._id})
    const message = req.session.message
    req.session.message= null
    res.render("appointment/all-appointment.ejs", {appointments: allAppointment, message: message})
})

// Create a new appointment 
router.get("/new/:doctorId", isSignedIn,(req,res)=>{
    res.render("appointment/create-appointment.ejs", {doctor: req.params.doctorId})
})

//Book an appointment 
router.post("/:doctorId", isSignedIn, async (req,res)=>{
    const bookAppointment = await Appointment.create({
        patient: req.session.user._id,
        doctor: req.params.doctorId,
        date: req.body.date,
        time: req.body.time,
        reason: req.body.reason,
    })
    req.session.message="Appointment Booked Successfully!"
    res.redirect("/appointments")
})

// Display appointment deatails 
router.get("/:appointmentId", isSignedIn,async(req,res)=>{
    const foundAppointment = await Appointment.findById(req.params.appointmentId)
    res.render("appointment/appointment-details.ejs", {appointment: foundAppointment})
})

// Update appointment 
router.get("/:appointmentId/edit", isSignedIn,async(req,res)=>{
    const foundAppointment = await Appointment.findById(req.params.appointmentId)
    res.render("appointment/update-appointment.ejs", {appointment: foundAppointment})
})

router.put("/:appointmentId", isSignedIn,async(req,res)=>{
    const {doctor, date, time,reason} = req.body
    const updateAppointment = await Appointment.findByIdAndUpdate(req.params.appointmentId,{
        doctor, date, time, reason, 
    })
    req.session.message="Appointment Updated Successfully!"

    res.redirect("/appointments")
})

// Cancel appointment 
router.delete("/:appointmentId",isSignedIn, async (req,res)=>{
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.appointmentId)
    req.session.message="Appointment Cancelled Successfully!"
    res.redirect("/appointments")
})


module.exports = router;
