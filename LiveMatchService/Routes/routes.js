const { matchSchedule, startingmatch, endmatch } = require("../Components/match")


 const route=require("express").Router()


 route.post("/matchSchedule",matchSchedule)
 route.put("/startingmatch",startingmatch)
 route.put("/endingmatch",endmatch)







 module.exports=route