const express = require("express")
const router = express.Router()
const Appointment = require("../models/Appointment")
const isSignedIn = require("../middleware/is-signed-in")


// Display all patient appointments 
router.get("/", async(req,res)=>{
    const allAppointment = await Appointment.find({patient: req.session.user._id})
    res.render("all-appointment.ejs", {appointment: allAppointment})
})

// Create a new appointment 
router.get("/new", isSignedIn,(req,res)=>{
    res.render("create-appointment.ejs")
})

//Book an appointment 
router.post("/", isSignedIn, async (req,res)=>{
    const bookAppointment = await Appointment.create({
        patient: req.session.user._id,
        doctor: req.body.doctor,
        date: req.body.date,
        time: req.body.time,
        reason: req.body.reason,
    })
    res.redirect("/appointments")
})

// Display appointment deatails 
router.get("/:appointmentId", isSignedIn,async(req,res)=>{
    const foundAppointment = await Appointment.findById(req.params.appointmentId)
    res.render("appointment-details.ejs", {appointment: foundAppointment})
})

// Update appointment 
router.get("/:appointmentId/edit", isSignedIn,async(req,res)=>{
    const foundAppointment = await Appointment.findById(req.params.appointmentId)
    res.render("update-appointment.ejs", {appointment: foundAppointment})
})

router.put("/:appointmentId", async(req,res)=>{
    const {doctor, date, time,reason} = req.body
    const updateAppointment = await Appointment.findByIdAndUpdate(req.params.appointmentId,{
        doctor, date, time, reason, 
    })

    res.redirect("/appointments")
})

// Cancel appointment 
router.delete("/:appointmentId",isSignedIn, async (req,res)=>{
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.appointmentId)
    res.redirect("/appointments")
})


module.exports = router;
