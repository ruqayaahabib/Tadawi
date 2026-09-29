const express = require("express")
const router = express.Router()

const Appointment = require("../models/Appointment")
const isSignedIn = require("../middleware/is-signed-in")
const isDoctor = require("../middleware/is-doctor")


// Doctor Dashboard 
router.get("/", isSignedIn,isDoctor ,async(req,res)=>{
    const totalAppointments = await Appointment.countDocuments({doctor: req.session.user._id})
    const pendingAppointments = await Appointment.countDocuments({doctor: req.session.user._id, status:"pending"})
    const completedAppointments = await Appointment.countDocuments({doctor: req.session.user._id, status:"completed"})
    const confirmedAppointments = await Appointment.countDocuments({doctor: req.session.user._id, status:"confirmed"})
    const upcomingAppointments = await Appointment.find({doctor:req.session.user._id, date: { $gte: new Date() }}).populate("patient").sort({date:1}).limit(5)
    res.render("doctor/doctor-dash.ejs", {totalAppointments, pendingAppointments, completedAppointments, confirmedAppointments, upcomingAppointments})
})


// Display all appointments assigend to the loged in doctor 
router.get("/appointments", isSignedIn,isDoctor, async(req,res)=> {
    const allAppointment = await Appointment.find({doctor: req.session.user._id}).populate("patient")
    const message = req.session.message
    req.session.message=null
    res.render("doctor/doctor-appointments.ejs", {appointments : allAppointment, message: message})
})

// Display appointment details 
router.get("/appointments/:appointmentId",isSignedIn, isDoctor, async(req,res)=>{
    const foundAppointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        doctor: req.session.user._id
    }).populate("patient")

    res.render("doctor/doctor-appointments-details.ejs", {appointment: foundAppointment})
})

// Update appointment status 
router.put("/appointments/:appointmentId",isSignedIn, isDoctor,async(req,res)=>{
    const updateAppointment = await Appointment.findOneAndUpdate({
        _id: req.params.appointmentId,
        doctor: req.session.user._id
    }, {
        status: req.body.status
    })

    req.session.message="Appointment Status Updated Successfully!"
    res.redirect("/doctor/appointments")

    
})

module.exports = router;
