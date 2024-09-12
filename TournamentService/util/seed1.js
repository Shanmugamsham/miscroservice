const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS schedule_tournaments(
      tournamentId VARCHAR(20) PRIMARY KEY,
      tournamentName VARCHAR(255),
      startDate DATE,
      endDate DATE,
      city VARCHAR(100),
      country VARCHAR(100),
      venue VARCHAR(255)
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('schedule_tournaments table created successfully.');
        }
    });
};

createUsersTable();