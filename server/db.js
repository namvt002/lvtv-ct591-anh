const mysql = require('mysql');

require('dotenv').config();

const connect = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

connect.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
});

module.exports = connect;
