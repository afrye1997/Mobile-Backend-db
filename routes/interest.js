/*
Will hold all CRUD APIs for Interests
*/

"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");

/**
 How to send it:
 {
    "interestUSER":"af027",
    "values":{
        "interestFOOD":"5",
        "interestOUTDOORS":"5"
    }
 }
 */
/**
ALL VALUES IN INTEREST TABLE
	interestUSER ,
	interestFOOD ,
	interestFOOD_COMMENT ,
	interestFASHION ,
	interestFASHION_COMMENT ,
	interestOUTDOORS ,
	interestOUTDOORS_COMMENT,
	interestGAMING ,
	interestGAMING_COMMENT ,
	interestMUSIC ,
	interestMUSIC_COMMENT ,
	interestREADING ,
	interestREADING_COMMENT ,
	constraint interestUSER_UNIQUE
    unique (interestUSER)

);

alter table INTERESTS
	add primary key (interestUSER);


 */
router.route("/getInterests").get(async(req,res,next)=>{
console.log("entered interests");
return res.status(200).send({
  isError: false,
  result: "Some typa test",
});

})
router.route("/updateInterests").post(async (req, res, next) => {
  console.log("updating interst");
  const request = req.body;
  var values = request.values;
  var TABLE = "UPDATE INTERESTS";
  var VALUES_TO_UPDATE = "SET ";
  var USER = `WHERE interestUSER= "${request.interestUSER}"`;

  for (column in values) {
    var value = values[column];
    VALUES_TO_UPDATE += `${column} = "${value}",`;
  }
  VALUES_TO_UPDATE = VALUES_TO_UPDATE.slice(0, -1);
  console.log(VALUES_TO_UPDATE);

  console.log("idk man", VALUES_TO_UPDATE);
  const UPDATE_USER_IN_INTEREST = `${TABLE} 
                                   ${VALUES_TO_UPDATE} 
                                   ${USER}`;

  connection.query(UPDATE_USER_IN_INTEREST, function (error, results, fields) {
    if (error) {
      console.log("Interests was NOT successfully updated!")
      return res.status(400).send({
        isError: true,
        result: "Error in updating interests table",
      });
    } else {
      console.log("Interests was successfully updated!")
      return res.status(200).send({
        isError: false,
        result: "Successfully updated",
      });
    }
  });
});

module.exports = router;
