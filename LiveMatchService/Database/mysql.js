const mysql = require('mysql2');
const util = require('util');
require('dotenv').config()




  const db = mysql.createConnection({
    host: 'mysql-apim-uat-db-server.mysql.database.azure.com',  
    user: 'mysqlapimdbadminuser',       
    password: 'wtt@sql@112',             
    database: 'lms_schedule',        
    port: 3306,                          
    // ssl: {
    //   rejectUnauthorized: true,         
    // }
  });
  

  db.query = util.promisify(db.query);


  const databaseCall = async () => {
    try {
      const result = await db.query('SELECT 1 + 1 AS solution');
      console.log('Database query result:', result);
      console.log('MySQL Connected and query executed successfully');
    } catch (error) {
      console.error('Error connecting to the database or executing query:', error);
    }
  };
  
  databaseCall();


  module.exports = db;