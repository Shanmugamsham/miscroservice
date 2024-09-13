const db = require('../Database/mysql');
const util = require('util');


const query = util.promisify(db.query).bind(db);


exports.matchSchedule= async (req, res) => {


    const matchSchedule = req.body.matchSchedule; 
   
    let successfulmatchSchedule = [];
    let failedmatchSchedule = [];


   
    if (!Array.isArray(matchSchedule) || matchSchedule.length === 0) {
        failedmatchSchedule.push({
           message: 'LiveMatchService expects an array',
         error: 'Please provide a list of match schedules'
        }); 
        return res.status(400).json({
            success: false,
            failedmatchSchedule
        });
       
    }

   
 

    try {

        for (const match of matchSchedule) {

            console.log( match);
            const {tournamentId,matchId, round, date, time ,player1Id,player2Id,liveMatchId} = match;
            
            
        
            if (!tournamentId||!matchId|| !round || !date||!time ||!player1Id||!player2Id||!liveMatchId) {
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
          
            let livemartch={
                liveMatchId:liveMatchId,
                matchId:matchId,
            }

            
             try {
                let sqlInsert = 'INSERT INTO match_schedule SET ?';
                 const result = await query(sqlInsert, matchdata);

                 successfulmatchSchedule.push({
                     matchId,
                     message: 'Matchschedule added successfully'
                 });
                
             } catch (dbError) {

                 console.error(`Database error for ${matchId}:`, dbError.message);
                 failedmatchSchedule.push({
                     matchId,
                     error: `Database error:${dbError.message}`
                 });
                 continue;
             }


            
            try {
                let sqlInsert = 'INSERT INTO lm_table_live_match SET ?';
                const result = await query(sqlInsert, livemartch);
                console.log(result);
                successfulmatchSchedule.push({
                    matchId,
                    message: 'Livematch table matchId added successfully'
                });
                
            } catch (dbError) {
                
                console.error(`Database error for ${matchId}:`, dbError.message);
                failedmatchSchedule.push({
                    matchId,
                    error: `Database error:${dbError.message}`
                });
                continue;
            }





        
            }
         if (successfulmatchSchedule.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'Match schedule processed successfully',
                successfulmatchSchedule,
                failedmatchSchedule
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No match schedule were processed successfully',
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



exports.startingmatch= async (req, res) => {


    const matchupdate= req.body.match; 
   console.log(matchupdate);
   
    let successfulmatchupdate = [];
    let failedmatchupdate = [];


   
    // if (!Array.isArray(matchupdate) || matchupdate.length === 0) {
    //     failedmatchupdate.push({
    //         message: 'LiveMatchService expecting Array',
    //         error: `Please provide a list of startingmatchdata`
    //     }); 
    //     return res.status(400).json({
    //         success: false,
    //         failedmatchupdate
    //     });
       
    // }

   
 

    try {

        // for (const match of matchupdate) {

            const {liveMatchId, matchId, liveStatus, currentSet} = matchupdate;
            
            
        
            if (!liveMatchId||!matchId|| !liveStatus||!currentSet) {
                failedmatchupdate.push({
                    liveMatchId:liveMatchId || 'Unknown',
                    error: 'Missing required fields: liveMatchId, matchId, liveStatus, currentSet'
                });
                // continue; 
            }
        
          
            

            
           

            
            try {
                
                let sqlCheck = 'SELECT COUNT(*) AS count FROM lm_table_live_match WHERE liveMatchId = ?';
               const [checkResult] = await query(sqlCheck, [liveMatchId]);
                 console.log(sqlCheck);
                 
               if (checkResult.count > 0) {
                // let sqlUpdate = 'UPDATE lm_table_live_match SET ? WHERE matchId = ?';
                // await query(sqlUpdate,matchdata,matchId);
                 
                let sqlUpdate = `UPDATE lm_table_live_match 
                         SET liveStatus = ?, currentSet = ?
                         WHERE liveMatchId = ?`;
                    await query(sqlUpdate, [liveStatus, currentSet, liveMatchId]);



                successfulmatchupdate.push({
                    liveMatchId,
                   message: 'Live match table starting data updated successfully'
                });
            } else {
                failedmatchupdate.push({
                    liveMatchId,
                    message: 'liveMatchId is missing and cannot update starting match data'
                });
            }
            } catch (dbError) {
                
                console.error(`Database error for ${matchId}:`, dbError.message);
                failedmatchupdate.push({
                    matchId,
                    error: `Database error:${dbError.message}`
                });
                // continue;
            // }

        
            }
         if (successfulmatchupdate.length > 0) {
            return res.status(201).json({
                success: true,
               message: 'Livematch table starting data updated successfully',
               successfulmatchupdate,
               failedmatchupdate
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No livematch table starting data were updated successfully',
              failedmatchupdate
            });
    
    } }catch (err) {
      
       console.log(err);
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}





exports.endmatch= async (req, res) => {


    const matchupdate= req.body.match; 

   
    let successfulmatchupdate = [];
    let failedmatchupdate = [];


    try {

         console.log();
         
            const {liveMatchId, liveStatus,score, winnerPlayerId} = matchupdate;;
            
            console.log(liveMatchId, liveStatus,score, winnerPlayerId);
            
        
            if (!liveMatchId||!score|| !liveStatus||!winnerPlayerId) {
                failedmatchupdate.push({
                  liveMatchId: liveMatchId || 'Unknown',
                    error: 'Missing required fields: liveMatchId,  liveStatus,score, winnerPlayerId,winnerPlayerName'
                });
               
            }
        
          
            

            
           

            
            try {
                
                let sqlCheck = 'SELECT COUNT(*) AS count FROM lm_table_live_match WHERE liveMatchId = ?';
               const [checkResult] = await query(sqlCheck, [liveMatchId]);
                 console.log(sqlCheck);
                 
               if (checkResult.count > 0) {
                // let sqlUpdate = 'UPDATE lm_table_live_match SET ? WHERE matchId = ?';
                // await query(sqlUpdate,matchdata,matchId);
                 
                let sqlUpdate = `UPDATE lm_table_live_match 
                         SET score = ?, liveStatus = ?, winnerPlayerId = ?
                         WHERE liveMatchId = ?`;
                    await query(sqlUpdate, [score,liveStatus, winnerPlayerId,liveMatchId]);



                successfulmatchupdate.push({
                    liveMatchId,
                    message: 'Livematchtable ending match data updated successfully'
                });
            } else {
                failedmatchupdate.push({
                    liveMatchId,
                    message: ' liveMatchId  matchId is missing and cannot update ending match data'
                });
            }
            } catch (dbError) {
                
                console.error(`Database error for ${matchId}:`, dbError.message);
                failedmatchupdate.push({
                    liveMatchId,
                    error: `Database error:${dbError.message}`
                });


        
            }
         if (successfulmatchupdate.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'livematchtable endingmatch datas updated successfully',
               successfulmatchupdate,
               failedmatchupdate
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No livematchtable  endingmatch datas were updated successfully',
              failedmatchupdate
            });
    
    } }catch (err) {
      
       console.log(err);
       
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}