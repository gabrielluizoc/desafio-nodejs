let mysql = require('mysql');
require('dotenv').config();

const localhost = {
    host     : "localhost",
    user     : "root",
    password : "root",
    database: "todo",
    port    : 3306,
    timezone : "UTC"
}

const host = {
    host     : process.env.MYSQL_PROD_HOST,
    user     : process.env.MYSQL_PROD_USER,
    password : process.env.MYSQL_PROD_PASS,
    database : process.env.MYSQL_PROD_DATABASE,
    port     : 3306,
    timezone: "UTC"
}

let pool  = mysql.createPool(localhost);

pool.on('connection', conn => {
    conn.query(`SET time_zone = ?;`,
        [process.env.MYSQL_TIMEZONE],
        error => {
            if(error) {
                throw error
            }
        });
});

module.exports = pool;
