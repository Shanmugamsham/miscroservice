const express=require("express");
const axios=require("axios");
const db=require("./Database/mysql")
const cors = require('cors');
const route  = require("./routes/route");
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())

 
 app.use("/api",route)

const port=process.env.PORT
app.listen(port,()=>{
   console.log(`UsersService:http://localhost:${port}`);
   
})

