const db=require("../Database/mysql")
require('dotenv').config()

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS  ns_table_notifications(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Notification table created successfully.');
        }
    });
};

createUsersTable();