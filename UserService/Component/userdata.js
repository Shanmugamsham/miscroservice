const axios=require("axios");
const util = require('util');
const db = require('../Database/mysql');
const query = util.promisify(db.query).bind(db);






exports.adduser=async(req,res,next)=>{

    const {name, email, password, subscription_type, is_subscribed} = req.body;

   
    if (!name || !email || !password ||!subscription_type||!is_subscribed) {
         return res.status(400).json({ msg: "Please provide name, email, password, subscription_type, is_subscribed" });
     }

    let Userdata = {
       name,
       email,
       password,
       is_subscribed,
       subscription_type
    };

    console.log(Userdata);

    try {
        
        let sqlInsert = 'INSERT INTO us_table_userdata SET ?';
        const result = await query(sqlInsert, Userdata);
        return res.status(201).json({
            success: true,
            message: ' Userdata added successfully',
            tournamentId: result.insertId  
        });

    } catch (err) {
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }

}












exports.userdata=async(req,res,next)=>{
console.log("working");

    try {
        
        const {subscription_type}=req.body

        const requireddata=subscription_type||"premium"
        
        let sqlSelect = 'SELECT * FROM us_table_userdata WHERE subscription_type = ?';
        const result = await query(sqlSelect, requireddata);
        return res.status(201).json({
            success: true,
            message: ' Userdata get successfully',
            result
        });

    } catch (err) {
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }

}

