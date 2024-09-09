const axios=require("axios");
const db = require('../Database/mysql');
const util = require('util');

// Promisify db.query
const query = util.promisify(db.query).bind(db);


exports.newtournament= async (req, res) => {
    const { tournamentName, location, date } = req.body;

   
    if (!tournamentName || !location || !date) {
         return res.status(400).json({ msg: "Please provide tournamentName, location, and date" });
     }

    let newTournament = {
        tournamentName: req.body.tournamentName,
        location: req.body.location,
        date: req.body.date
    };


    try {
        
         const{data}= await axios.post("http://localhost:3001/api/notificationactive",{newTournament})
          console.log(`......Notification Service Response`);
           
        
         if(data.success==true){
            let sqlInsert = 'INSERT INTO ts_table_addtournament SET ?';
            const result = await query(sqlInsert, newTournament);
            return res.status(201).json({
                success: true,
                message: 'New tournament added successfully', 
                notification_message: 'Notification send to subscribed members successfully', 
            })
            
         }else{
            return res.status(400).json({
                success: false,
                message:'Notification Service Erro'
            });

         }
       
    } catch (err) {
      
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}