require("dotenv").config();
const mysql= require('mysql') 

const connection= mysql.createConnection({
    host:"mobile-app.ddns.uark.edu",
    user:"squad",
    password: "g04Lz",
    database:"csce4623",
    multipleStatements:true
});

module.exports = connection;