const { participants } = require("../Components/players")

 const route=require("express").Router()


 route.post("/addparticipants",participants)







 module.exports=route