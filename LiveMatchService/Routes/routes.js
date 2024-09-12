const { matchSchedule } = require("../Components/match")


 const route=require("express").Router()


 route.post("/matchSchedule",matchSchedule)







 module.exports=route