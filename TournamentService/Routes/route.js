const { newtournament } = require("../Components/Newtournament")
 const route=require("express").Router()



 route.post("/addnewtournament",newtournament)







 module.exports=route