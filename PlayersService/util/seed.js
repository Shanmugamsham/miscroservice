const db = require("../Database/mysql");
require('dotenv').config();

const createPlayersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS ps_table_players(
      player_id INT AUTO_INCREMENT PRIMARY KEY,
      player_name VARCHAR(255) NOT NULL,
      country VARCHAR(100) NOT NULL,
      ranking INT NOT NULL,
      birth_date DATE,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Players table created successfully.');
        }
    });
};
createPlayersTable();