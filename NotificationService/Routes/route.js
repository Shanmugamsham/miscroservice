const { notification } = require("../Components/notification")

 const route=require("express").Router()



 route.post("/notificationactive",notification)







 module.exports=route