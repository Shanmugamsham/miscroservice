const db = require('../Database/mysql');
const util = require('util');


const query = util.promisify(db.query).bind(db);


exports.matchSchedule= async (req, res) => {


    const matchSchedule = req.body.matchSchedule; 
   
    let successfulmatchSchedule = [];
    let failedmatchSchedule = [];


   
    if (!Array.isArray(matchSchedule) || matchSchedule.length === 0) {
        failedmatchSchedule.push({
            message: 'LiveMatchService expecting Array',
            error: `Please provide a list of matchschedule`
        }); 
        return res.status(400).json({
            success: false,
            failedmatchSchedule
        });
       
    }

   
 

    try {

        for (const match of matchSchedule) {

            console.log( match);
            const {tournamentId,matchId, round, date, time ,player1Id,player2Id} = match;
            
            
        
            if (!tournamentId||!matchId|| !round || !date||!time ||!player1Id||!player2Id) {
                failedmatchSchedule.push({
                    matchId: match.matchId || 'Unknown',
                    error: 'Missing required fields: tournamentId,matchId, round, date, time ,player1,player2'
                });
                continue; 
            }
        
            let matchdata = {
                matchId:matchId,
                tournamentId:tournamentId,
                round:round,
                matchDate:date,
                matchTime:time,
                player1Id:player1Id,
                player2Id:player2Id

            };
          

            
            try {
                let sqlInsert = 'INSERT INTO match_schedule SET ?';
                const result = await query(sqlInsert, matchdata);

                successfulmatchSchedule.push({
                    matchId,
                    message: ' matchSchedule added  successfully'
                });
                
            } catch (dbError) {
                
                console.error(`Database error for ${matchId}:`, dbError.message);
                failedmatchSchedule.push({
                    matchId,
                    error: `Database error:${dbError.message}`
                });
            }

        
            }
         if (successfulmatchSchedule.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'matchSchedule processed successfully',
                successfulmatchSchedule,
                failedmatchSchedule
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No matchSchedule were processed successfully',
               failedmatchSchedule
            });
    
    } }catch (err) {
      
       console.log(err);
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}