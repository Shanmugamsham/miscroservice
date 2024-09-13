const axios = require('axios');
const db = require('../Database/mysql');
const util = require('util');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

async function  loadTemplate (templateName, data) {
    
    
    const filePath = await path.join(__dirname, '..', 'templates', `${templateName}.json`);
  
    if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`);
     }
    const template = await fs.readFileSync(filePath,'utf-8');
    return mustache.render(template, data);
  }
  
  const query = util.promisify(db.query).bind(db);

exports.notification=async(req,res,next)=>{
          console.log(" notification working");
          
          let successfulnotification = [];
          let failedNotification = [];
        const {newTournament,messageType}=req.body
    
    
     if (!newTournament) {
        failedNotification.push({
            message: 'NotificationService',
            error: `Please provide tournamentNotificationdata`
        }); 
        return res.status(400).json({
            success: false,
            failedNotification
        });
     }



     let messagetype=messageType.message
     let smslTemplate = await loadTemplate('smsTemplate',newTournament); 
     let message=JSON.parse(smslTemplate)
     
     if (!message[messagetype]) {
        failedNotification.push({
            message: 'NotificationService',
            error: `Invalid message type.`
        }); 
        return res.status(400).json({
            success: false,
            failedNotification
        });
        
    }
     
     message=message[messagetype]
    
     console.log(message);
     

     try {

        let newdata;
        try {
           const {data} = await axios.get("http://localhost:3002/api/getsubscribeduser")
            newdata=data.result
            successfulnotification.push({
                success:true,
                message: "UsersServicedata get successfully"
            });
          
        } catch (error) {   
           failedNotification.push({
                success:false,
                message:`UsersService`,
                error: error.response.data.failedmatchSchedule
            });
        }
           


         try {
           for (const d of newdata) {
            const newmessage={
                user_id:d.id,
               message:message,
             }
           let sqlInsert = 'INSERT INTO ns_table_notifications SET ?';
            let  result = await query(sqlInsert, newmessage);
          }
          successfulnotification.push({
            success: true,
            message: 'Notification  added successfully', 
        });
         } catch (error) {
            failedNotification.push({
                success: false,
               message: "NotificationService",
                error: 'Database error: ' + error.message,
            });
            
         }

         if (successfulnotification.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'Notification processed successfully',
                successfulnotification,
                failedNotification
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No Notification were processed successfully',
                failedNotification
            });
    
    }

          
            

     } catch (err) {
        console.log(err);
        
         return res.status(500).json({
             success: false,
             message: 'Database error: ' + err.message,
             error: 'Server Error'
         });
     }

}