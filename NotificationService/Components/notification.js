const axios = require('axios');
const db = require('../Database/mysql');
const util = require('util');

const query = util.promisify(db.query).bind(db);

exports.notification=async(req,res,next)=>{
    
     const {newTournament}=req.body

     console.log(newTournament.tournamentName);
    
     if (!newTournament) {
         return res.status(400).json({ msg: "Please provide tournamentName, location, and date" });
     }

    try {
         const{ data} = await axios.get("http://localhost:3002/api/getsubscribeduser")
         const newdata=data.result
         console.log(`......User Service Response`);
         console.log(newdata);
         
         

       
         const tournamentName = newTournament.tournamentName||"World Table Tennis Championship";
         const location = newTournament.location ||"Tokyo";
         const date =newTournament.date||"2024-12-01";
         

          
         const message = `Hello! A new tournament is coming up: ${tournamentName}. It will be held at ${location} on ${date}. Get ready to cheer for the participants!`;
    
     
          let result;
          newdata.forEach(async(d) => {
             const newmessage={
                 user_id:d.id,
                 message:message,
             }
           let sqlInsert = 'INSERT INTO ns_table_notifications SET ?';
              result = await query(sqlInsert, newmessage);
          });
          
           return res.status(201).json({
              success: true,
              message: 'Notification  added successfully', 
         });

        


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }

}