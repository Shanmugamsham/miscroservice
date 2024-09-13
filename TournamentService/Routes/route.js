const { newtournament, scheduletournaments, startingmatch, endmatch } = require("../Components/Newtournament")
 const route=require("express").Router()



 route.post("/addnewtournament",newtournament)
 route.post("/scheduletournaments",scheduletournaments)
 route.post("/matchstarting",startingmatch)
 route.post("/matchending",endmatch)







 module.exports=route