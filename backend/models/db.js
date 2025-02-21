const mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
    host: 'localhost', 
    user: 'root',
    password: 'Dakshata@2023',
    database: 'leaveapp',
});

console.log('Connected to MySQL database!');

module.exports = connection;