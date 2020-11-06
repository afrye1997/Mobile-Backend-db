require("dotenv").config();
const mysql= require('mysql') 

const connection= mysql.createConnection({
    host:process.env.HOST,
    user:"admin",
    password: process.env.DB_PASSWORD,
    database:"csce4623"
});

module.exports = connection;