const db = require("../Database/mysql");
require('dotenv').config();

const createPlayersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS ps_table_participants(
       playerId VARCHAR(20), 
       playerName VARCHAR(255),
       ranking INT,
       country VARCHAR(100),
      FOREIGN KEY (playerId) REFERENCES ps_table_players(playerId) 
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('participants table created successfully.');
        }
    });
};
createPlayersTable();