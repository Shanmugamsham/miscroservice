const { newtournament, scheduletournaments } = require("../Components/Newtournament")
 const route=require("express").Router()



 route.post("/addnewtournament",newtournament)
 route.post("/scheduletournaments",scheduletournaments)







 module.exports=route