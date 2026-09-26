const express = require("express")
const router = express.Router()

const Appointment = require("../models/Appointment")
const isDoctor = require("../middleware/is-doctor")


// Doctor Dashboard 
router.get("/", isDoctor ,async(req,res)=>{
    res.render("doctor/doctor-dash.ejs")
})


// Display all appointments assigend to the loged in doctor 
router.get("/appointments", isDoctor, async(req,res)=> {
    const allAppointment = await Appointment.find({doctor: req.session.user._id}).populate("patient")
    const message = req.session.message
    req.session.message=null
    res.render("doctor/doctor-appointments.ejs", {appointments : allAppointment, message: message})
})

// Display appointment details 
router.get("/appointments/:appointmentId", isDoctor, async(req,res)=>{
    const foundAppointment = await Appointment.findById(req.params.appointmentId).populate("patient")

    res.render("doctor/doctor-appointments-details.ejs", {appointment: foundAppointment})
})

// Update appointment status 
router.put("/appointments/:appointmentId",isDoctor,async(req,res)=>{
    const updateAppointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, {
        status: req.body.status
    })

    req.message.session="Appointment Status Updated Successfully!"
    res.redirect("/doctor/appointments")

    
})

module.exports = router;
