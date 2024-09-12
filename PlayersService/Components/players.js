const db = require('../Database/mysql');
const util = require('util');


const query = util.promisify(db.query).bind(db);


exports.participants= async (req, res) => {


    const participants = req.body.participants; 
   
    let successfulparticipants = [];
    let failedparticipants = [];


   
    if (!Array.isArray(participants) || participants.length === 0) {
        failedparticipants.push({
            message: 'PlayersServicer expecting Array',
            error: `Please provide a list of participants`
        });
        
        return res.status(400).json({
            success: false,
            failedparticipants
        });
       
    }

   
  
     

 

    try {

        for (const participantplayer of participants) {

            const {playerId, playerName, ranking,country } =  participantplayer;
            
            
        
            if (!playerId || !playerName || !ranking ||!country) {
                failedparticipants.push({
                    playerName:playerName || 'Unknown',
                    playerId:playerId || 'Unknown',
                    error: 'Missing required fields: playerId, playerName, ranking,countrye'
                });
                continue; 
            }
        
            let participants = {
                playerId,
                playerName,
                ranking,
                country

            };
          
    
            try {
                
                let sqlInsert = 'INSERT INTO  ps_table_participants SET ?';
                const result = await query(sqlInsert, participants);

                successfulparticipants.push({
                    playerName,
                    message: ' participants added  successfully'
                });
                
            } catch (dbError) {
                
                console.error(`Database error for ${playerName}:`, dbError.message);
                failedparticipants.push({
                    playerName,
                    playerId,
                    error: `Database error:${dbError.message}`
                });
            }
            }



         if (successfulparticipants.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'participants processed successfully',
                successfulparticipants,
                failedparticipants
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No participants were processed successfully',
                failedparticipants
            });
    
    } }catch (err) {
      
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}