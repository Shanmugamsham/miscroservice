const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS lm_table_live_match (
      liveMatchId INT AUTO_INCREMENT PRIMARY KEY,
      matchId VARCHAR(20),
      liveStatus ENUM('ongoing', 'completed', 'scheduled') DEFAULT 'scheduled',
      score VARCHAR(50),
      currentSet INT,
      winnerPlayerId VARCHAR(20),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (matchId) REFERENCES match_schedule(matchId) 
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('lm_table_live_match table created successfully.');
        }
    });
};

createUsersTable();


// const sql = `
//     CREATE TABLE IF NOT EXISTS lm_table_live_match (
//       liveMatchId INT AUTO_INCREMENT PRIMARY KEY,
//       matchId VARCHAR(20),
//       liveStatus ENUM('ongoing', 'completed', 'scheduled') DEFAULT 'scheduled',
//       score VARCHAR(50),
//       currentSet INT,
//       winnerPlayerId VARCHAR(20),
//       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       CONSTRAINT fk_match FOREIGN KEY (matchId) REFERENCES match_schedule(matchId),
//       CONSTRAINT fk_winnerPlayer FOREIGN KEY (winnerPlayerId) REFERENCES ps_table_players(player_id)
//     );
//   `;


// USE livematchservicedb;

// SELECT * 
// FROM match_schedule
// LEFT JOIN lm_table_live_match
// ON match_schedule.matchId = lm_table_live_match.matchId;
  