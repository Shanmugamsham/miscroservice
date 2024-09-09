const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS  ts_table_addtournament(
      id INT AUTO_INCREMENT PRIMARY KEY,
      tournamentName VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Tournament table created successfully.');
        }
    });
};

createUsersTable();