const express=require("express");
const cors = require('cors');
 const route  = require("./Routes/routes");
const db=require("./Database/mysql")
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())

 app.use("/api",route)

const port=process.env.PORT
app.listen(port,()=>{
   console.log(`LIveMatchService:http://localhost:${port}`);
   
})

