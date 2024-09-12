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
                    error: 'Missing required fields: tournamentName, location, or date'
                });
                continue; 
            }
        
            let newTournament = {
                tournamentName,
                location,
                date
            };
            let messagetype={
                message:"messageaddtournamnets"
               }
           
            
            const { data } = await axios.post("http://localhost:3001/api/notificationactive", { newTournament,messagetype });
            console.log(`......Notification Service Response for ${tournamentName}`);
            



            
            if (data.success == true) {
                
                let sqlInsert = 'INSERT INTO ts_table_addtournament SET ?';
                const result = await query(sqlInsert, newTournament);

                successfulTournaments.push({
                    tournamentName,
                    message: 'Tournament added and notification sent successfully'
                });
            } else {
                failedTournaments.push({
                    tournamentName,
                    error: 'Notification Service Error'
                });
            }
        }
         
         if (successfulTournaments.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'Tournaments processed successfully',
                successfulTournaments,
                failedTournaments
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No tournaments were processed successfully',
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
            message: 'tournamentsService expecting Array',
            error: `Please provide a list of 'tournaments`
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

            
            //   let matchSchedul;
            //   try {
            //       matchSchedul = await axios.post("http://localhost:3005/api/matchSchedule", {matchSchedule});
            //       matchSchedul =matchSchedul.data;
            //       console.log(`LiveMatchService Response:`);
            //           successfulTournaments.push({
            //            tournamentName,
            //            success:matchSchedul.success,
            //            message: matchSchedul.message
            //        });
                
            //   } catch (error) {
            //       console.error(`NotificationService error for ${tournamentName}:`, error.message);
            //       failedTournaments.push({
            //           tournamentName,
            //           message:`LiveMatchServicer`,
            //           error: error.response.data.failedmatchSchedule

            //       });
            //       continue; 
            //   }

           
            //   let Playersservice;
            //   try {
            //       Playersservice = await axios.post("http://localhost:3004/api/addparticipants", { participants });
            //       Playersservice = Playersservice.data;
            //       successfulTournaments.push({
            //          tournamentName,
            //          success:Playersservice.success,
            //          message: Playersservice.message
            //     });
            //       console.log(`PlayersService Response:`, Playersservice);
            //   } catch (error) {
            //       console.error(`PlayerService error for ${tournamentName}:`, error.message);
            //       console.log(error);
                  
            //       failedTournaments.push({
            //         tournamentName,
            //         message:"PlayerService error",
            //         error: error.response.data.failedparticipants
            //       });
            //       continue; 
            //   }

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
                        message: Notificationservice.message
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
          


            //  try {
            //      let sqlInsert = 'INSERT INTO schedule_tournaments SET ?';
            //      const result = await query(sqlInsert, newTournament);
            //      successfulTournaments.push({
            //         tournamentName,
            //         message: 'scheduleTournament added  successfully'
            //     });
            //  } catch (dbError) {
            //      console.error(`Database error for ${tournamentName}:`, dbError.message);
            //      failedTournaments.push({
            //          tournamentName,
            //          message:"scheduleTournamentservice",
            //          error: `Database error: ${dbError.message}`
            //      });
            //  }
        }

       
       
        if (successfulTournaments.length > 0) {
            return res.status(201).json({
                success: true,
                message: 'scheduleTournaments processed successfully',
                successfulTournaments,
                failedTournaments
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No scheduleTournaments were processed successfully',
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
