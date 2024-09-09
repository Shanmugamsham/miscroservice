const { userdata, adduser } = require("../Component/userdata")

 const route=require("express").Router()



 route.get("/getsubscribeduser",userdata)
 route.post("/adduser",adduser)







 module.exports=route