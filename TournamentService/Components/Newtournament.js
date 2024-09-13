const axios=require("axios");
const db = require('../Database/mysql');
const util = require('util');


const query = util.promisify(db.query).bind(db);


exports.newtournament= async (req, res) => {


    const tournaments = req.body.tournaments; 
    
    
   
    if (!Array.isArray(tournaments) || tournaments.length === 0) {
        return res.status(400).json({ msg: "Please provide a list of tournaments" });
    }

   
    let successfulTournaments = [];
    let failedTournaments = [];

     

 

    try {

        for (const tournament of tournaments) {

            console.log(tournament);
            
            const { tournamentName, location, date } = tournament;
            
            
        
            if (!tournamentName || !location || !date) {
                failedTournaments.push({
                    tournamentName: tournament.tournamentName || 'Unknown',
                    error: 'Missing required fields: tournamentName, location, or date',
                    Service:"TournamentService"
                });
                continue; 
            }
        
            let newTournament = {
                tournamentName,
                location,
                date
            };
            
               let messageType = {message:"messageaddtournamnets" };
            
            const { data } = await axios.post("http://localhost:3001/api/notificationactive", { newTournament,messageType });
            console.log(`......Notification Service Response for ${tournamentName}`);
            



            
            if (data.success == true) {
                
                let sqlInsert = 'INSERT INTO ts_table_addtournament SET ?';
                const result = await query(sqlInsert, newTournament);

                successfulTournaments.push({
                    tournamentName,
                    message: 'Tournament added and notification sent successfully',
                    Service:"TournamentService"
                });
            } else {
                failedTournaments.push({
                    tournamentName,
                    error: 'Notification Service Error',
                    Service:"TournamentService"
                });
            }
        }
         
         if (successfulTournaments.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'Tournaments processed successfully',
                Service:" Final output TournamentService",
                successfulTournaments,
                failedTournaments
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No tournaments were processed successfully',
                Service:" Final output TournamentService",
                failedTournaments
            });
    
    } }catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Database error: ' + err.message
        });
    }
}



exports.scheduletournaments = async (req, res) => {
    const tournaments = req.body.tournaments;
     let successfulTournaments = [];
    let failedTournaments = [];


    if (!Array.isArray(tournaments) || tournaments.length === 0) {
        failedTournaments.push({
            message: 'tournamentsService expects an array',
            error: "Please provide a list of 'scheduleTournaments'",
            Service:"TournamentService"
        });
        
        return res.status(400).json({
            success: false,
            failedTournaments
        });
        
    }

   
    try {
        for (const tournament of tournaments) {
            const { tournamentId, tournamentName, location, startDate, endDate, participants, matchSchedule, notification } = tournament;

            if (!tournamentName || !location || !startDate || !endDate || !participants || !matchSchedule || !notification) {
                failedTournaments.push({
                    tournamentName: tournamentName || 'Unknown',
                    error: "Missing required fields: tournamentName, location, startDate, endDate, participants, matchSchedule, notification"
                });
                continue;
            }

            let newTournament = {
                tournamentId,
                tournamentName,
                startDate,
                endDate,
                city: location.city,
                country: location.country,
                venue: location.venue
            };

            let messageType = { message: "messageschedule" };

            
               let matchSchedul;
              try {
                  matchSchedul = await axios.post("http://localhost:3005/api/matchSchedule", {matchSchedule});
                   matchSchedul =matchSchedul.data;
                  console.log(`LiveMatchService Response:`);
                       successfulTournaments.push({
                       tournamentName,
                       success:matchSchedul.success,
                        message: matchSchedul.message,
                        Service:"LiveMatchService"
                    });
                
               } catch (error) {
                   console.error(`NotificationService error for ${tournamentName}:`, error.message);
                   failedTournaments.push({
                       tournamentName,
                       message:`LiveMatchService`,
                       error: error.response.data.failedmatchSchedule

                  });
                   continue; 
               }

           
               let Playersservice;
               try {
                   Playersservice = await axios.post("http://localhost:3004/api/addparticipants", { participants });
                   Playersservice = Playersservice.data;
                   successfulTournaments.push({
                      tournamentName,
                      success:Playersservice.success,
                      message: Playersservice.message,
                        Service:" Playersservice"
                 });
    
              } catch (error) {
                   failedTournaments.push({
                     tournamentName,
                     message:"PlayerService error",
                     error: error.response.data.failedparticipants
                   });
                   continue; 
               }



               try {
                let sqlInsert = 'INSERT INTO schedule_tournaments SET ?';
                const result = await query(sqlInsert, newTournament);
                successfulTournaments.push({
                  tournamentName,
                   message: 'scheduleTournament added successfully',
                   Service:"TournamentService"
                   
               });
            } catch (dbError) {
                console.error(`Database error for ${tournamentName}:`, dbError.message);
                failedTournaments.push({
                    tournamentName,
                    message:"ScheduleTournamentService",
                    error: `Database error: ${dbError.message}`
                });
                continue; 
            }

           let Notificationservice;
              try {
                   Notificationservice = await axios.post("http://localhost:3001/api/notificationactive", { newTournament, messageType });
                  Notificationservice = Notificationservice.data;
                  console.log(`NotificationService Response:`);
                  console.log(Notificationservice);
                  
                  console.log( Notificationservice);
                         successfulTournaments.push({
                        tournamentName,
                        success:Notificationservice.success,
                        message: Notificationservice.message,
                        Service:"NotificationService"
                   });
                 
              } catch (error) {
                   console.error(`NotificationService error for ${tournamentName}:`, error.message);
                   failedTournaments.push({
                    tournamentName,
                     message:"NotificationService error",
                     error: error.response.data.failedNotification
                      
                  });
                  continue; 
              }
          


             
        }

       
       
        if (successfulTournaments.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'scheduleTournaments processed successfully',
                Service:" Final output TournamentService",
                successfulTournaments,
                failedTournaments
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No scheduleTournaments were processed successfully',
                Service:" Final output TournamentService",
                failedTournaments
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + err.message
        });
    }
};




exports.startingmatch = async (req, res) => {
    const matches = req.body.matches;
     let successfulmatches = [];
    let failedmatches = [];


    if (!Array.isArray(matches) || matches.length === 0) {
        failedmatches.push({
            message: 'tournamentsService expects an array',
            error: 'Please provide a list of starting match data'
        });
        
        return res.status(400).json({
            success: false,
            failedmatches
        });
        
    }

   
    try {
        for (const match of matches) {
            const { liveMatchId, matchId, liveStatus, currentSet, players, matchTime } = match;

            if (!liveMatchId || !matchId || !liveStatus || !currentSet || !players || !matchTime) {
                failedmatches.push({
                    liveMatchImessage:liveMatchId || 'Unknown',
                    error: "Missing required fields: liveMatchId, matchId, liveStatus, currentSet, players, matchTime",
                    Service:"Tournamentservice"
                });
                continue;
            }

            let  matchupdate = {
                liveMatchId,
                matchId,
                liveStatus,
                currentSet,
                players,
                matchTime

            };

           let newTournament={
            liveMatchId,
            matchId,
            liveStatus,
            currentSet,
            players1:players[0],
            players2:players[1],
            matchTime

           }

            let messageType = { message: "startingmatch" };

            
               let startingmatchupdate;
              try {
                startingmatchupdate= await axios.put("http://localhost:3005/api/startingmatch",{match});
                startingmatchupdate=startingmatchupdate.data;
                  console.log(`LiveMatchService Response:`);
                       successfulmatches.push({
                       liveMatchId,
                       success:startingmatchupdate.success,
                        message:startingmatchupdate.message,
                        Service:`LiveMatchServicer`,
                    });
                
               } catch (error) {
                   console.error(`NotificationService error for ${liveMatchId}:`, error.message);
                   failedmatches.push({
                       message:`LiveMatchServicer`,
                       error: error.response.data.failedmatchupdate

                  });
                   continue; 
               }

           

            let Notificationservice;
               try {
                     Notificationservice = await axios.post("http://localhost:3001/api/notificationactive", { newTournament, messageType });
                    Notificationservice = Notificationservice.data;
                   console.log(`NotificationService Response:`);
                   console.log(Notificationservice);
                  
                   console.log( Notificationservice);
                          successfulmatches.push({
                        success:Notificationservice.success,
                         message: Notificationservice.message,
                         Service:"NotificationService"
                    });
                 
                } catch (error) {
                  console.error(`NotificationService error for ${tournamentName}:`, error.message);
                   failedmatches.push({
                      tournamentName,
                       message:"NotificationService error",
                        error: error.response.data.failedNotification
                      
                  });
                   continue; 
               }
          

        }

       
       
        if (successfulmatches.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'Starting match processed successfully',
                Service:" Final output TournamentService",
                successfulmatches,
                failedmatches
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No starting matches were processed successfully',
                Service:" final output TournamentService",
                failedmatches
            });
        }

    } catch (err) {
        console.log(err);
        
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + err.message
        });
    }
};











exports.endmatch = async (req, res) => {
    const matches = req.body.completedMatches;
     let SuccessfulMatchesEnd = [];
    let FailedMatchesEnd = [];


    if (!Array.isArray(matches) || matches.length === 0) {
        FailedMatchesEnd.push({
            message: 'tournamentsService expects an array',
            error: 'Please provide a list of ending match data'            
        });
        
        return res.status(400).json({
            success: false,
            FailedMatchesEnd
        });
        
    }

   
    try {
        for (const match of matches) {
            
            const { liveMatchId,  liveStatus,score, winnerPlayerId,winnerPlayerName} = match;

            if (!liveMatchId || !score || !liveStatus || !winnerPlayerId || !winnerPlayerName) {
               FailedMatchesEnd.push({
                    liveMatchImessage:liveMatchId || 'Unknown',
                    error: "Missing required fields: liveMatchId,  liveStatus,score, winnerPlayerId,winnerPlayerName",
                   Service:"TournamentService"
                });
                continue;
            }


           let newTournament={
            liveMatchId,
            liveStatus,
            winnerPlayerId,
            score,
            winnerPlayerName
           }

            let messageType = { message: "endingmatch" };

            
               let endmatchupdate;
              try {
               endmatchupdate= await axios.put("http://localhost:3005/api/endingmatch",{match});
               endmatchupdate=endmatchupdate.data;
                  console.log(`LiveMatchService Response:`);
                       SuccessfulMatchesEnd.push({
                       liveMatchId,
                       success:endmatchupdate.success,
                        message:endmatchupdate.message,
                        Service:"LiveMatchService"
                    });
                
               } catch (error) {
                   console.error(`NotificationService error for ${liveMatchId}:`, error.message);
                  FailedMatchesEnd.push({
                       message:`LiveMatchServicer`,
                       error: error.response.data.failedmatchupdate

                  });
                   continue; 
               }

           

            let Notificationservice;
              try {
                    Notificationservice = await axios.post("http://localhost:3001/api/notificationactive", { newTournament, messageType });
                    Notificationservice = Notificationservice.data;
                    console.log(`NotificationService Response:`);
                    console.log(Notificationservice);
                  
                    console.log( Notificationservice);
                          SuccessfulMatchesEnd.push({
                         success:Notificationservice.success,
                      message: Notificationservice.message,
                      Service:"NotificatuionService"
                     });
                 
               } catch (error) {
                console.log(error);
                
                   console.error(`NotificationService error for:`, error.message);
                  FailedMatchesEnd.push({
                       message:"NotificationService error",
                      error: error.response.data.failedNotification
                      
                  });
                    continue; 
                }
          

        }

       
       
        if (SuccessfulMatchesEnd.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'End match processed successfully',
                Service:" Final output TournamentService",
               SuccessfulMatchesEnd,
                FailedMatchesEnd
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No end matches were processed successfully',
                Service:" Final output TournamentService",
               FailedMatchesEnd
            });
        }

    } catch (err) {
        console.log(err);
        
        return res.status(500).json({
            success: false,
            message: 'Server error: ' + err.message
        });
    }
};




