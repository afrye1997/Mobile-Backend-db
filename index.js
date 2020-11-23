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

const interest= require ("./routes/interest")
app.use("/interest", interest);


app.get("/", (req,res)=>{
    res.send("CRUD API running")
});

app.listen(PORT,  err=>{ 
    (err===null? console.log("ERROR", err):console.log("CRUD API running") )
});



//  {
//      "bool":false,
//      "actual_msg":err.msg
//  }