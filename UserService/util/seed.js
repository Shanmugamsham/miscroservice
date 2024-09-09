const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS  us_table_userdata(
      id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     is_subscribed BOOLEAN DEFAULT FALSE,
    subscription_type ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Users table created successfully.');
        }
    });
};

createUsersTable();