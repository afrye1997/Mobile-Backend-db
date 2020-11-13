"use strict"
const express= require('express')
const cors= require('cors')
const app= express();

app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT= 4000;
app.use(cors());


const user= require ("./routes/user")
app.use("/users", user);

app.get("/", (req,res)=>{
    res.send("CRUD API running")
});

app.listen(PORT,  err=>{ 
    (err? console.log("ERROR", err):console.log("CRUD API running") )
});

//TODO
/**
 * 1) CREATE A USER
 * 2) READ A USER
 * 3) UPDATE A USER
 * 4) DELETE A USER
 */

//  {
//      "bool":false,
//      "actual_msg":err.msg
//  }