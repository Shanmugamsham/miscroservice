const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS match_schedule (
      matchId VARCHAR(20) PRIMARY KEY,
      tournamentId VARCHAR(20), 
      round VARCHAR(50),
      matchDate DATE,
      matchTime TIME,
      player1Id VARCHAR(20),    
      player2Id VARCHAR(20)     
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('match_schedule table created successfully.');
        }
    });
};

createUsersTable();