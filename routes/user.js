/*
Will hold all CRUD APIs for Users
*/

"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");


/**
 * create table USERS
(
	userID varchar(50) not null,
	userFNAME varchar(50) not null,
	userLNAME varchar(50) not null,
	userEMAIL varchar(45) not null,
	userHOMETOWN varchar(45) null,
	userGENDER varchar(45) null,
	userPROFILEPIC varchar(50) null,
	userGRADE_LEVEL int null,
	userABOUT varchar(150) null,
	userGRAD_DATE varchar(100) null,
	userMAJOR varchar(50) null,
	userCLASSES varchar(150) null,
	userPROGRAM_EXP int null,
	constraint userID_UNIQUE
		unique (userID)
);

alter table USERS
	add primary key (userID);


 */

  //GET THE USER
router.route("/getAllUsers").get(async (req, res, next) => {
  //so param is called USER_id
  const USER_id = req.query.USER_id; 
  console.log(USER_id);
  connection.query(
    "SELECT * FROM USERS",
    function (error, results, fields) {
      //if error or user does not exist in db
      if (error || Object.entries(results).length === 0) {
        console.log("ERROR", error);
        return res.status(400).send({
          isError: true,
          result: error === null ? "No users in db" : error,
        });
      } else {
        console.log("Ppl in the db:", results);
        res.status(200).send({
          isError: false,
          result: results,
        });
      }
    }
  );
});


 //GET THE USER
router.route("/getUser").get(async (req, res, next) => {
  //so param is called USER_id
  const USER_id = req.query.USER_id;
  console.log(USER_id);
  connection.query(
    `SELECT * FROM USERS WHERE userID='${USER_id}';`,
    function (error, results, fields) {
      //if error or user does not exist in db
      if (error || Object.entries(results).length === 0) {
        console.log("ERROR", error);
        return res.status(400).send({
          isError: true,
          result: error === null ? "user not in db" : error,
        });
      } else {
        console.log("The solution is: ", results);
        res.status(200).send({
          isError: false,
          result: results,
        });
      }
    }
  );
});

/**
 *  
 {
    "userID":"af027",
    "values":{
        "userHOMETOWN":"Kansas City",
        "userMAJOR":"Computer Science",
        "userGRAD_DATE":"May '21"
    }
 }

 */

// UPDATE THE USER
router.route("/updateUser").post(async (req, res, next) => {
  console.log("updating user");
  const request = req.body;
  var values = request.values;
  var TABLE = "UPDATE USERS";
  var VALUES_TO_UPDATE = "SET ";
  var USER = `WHERE userID= "${request.userID}"`;

  for (column in values) {
    var value = values[column];
    VALUES_TO_UPDATE += `${column} = "${value}",`;
  }
  VALUES_TO_UPDATE = VALUES_TO_UPDATE.slice(0, -1);
  const UPDATE_USER_IN_USERTABLE = `${TABLE} 
                                   ${VALUES_TO_UPDATE} 
                                   ${USER}`;


  connection.query(UPDATE_USER_IN_USERTABLE, function (error, results, fields) {
  if (error) {
    console.log("User was NOT successfully updated!")
    return res.status(400).send({
      isError: true,
      result: "Error in updating interests table",
    });
  } else {
    console.log("User was successfully updated!")
    return res.status(200).send({
      isError: false,
      result: "Successfully updated USER",
    });
  }
});
});


// ADD USER
router.route("/addUser").post(async (req, res, next) => {
  console.log("addUser was called");
  const { USER } = req.body;

  const INSERT_USER_QUERY = `INSERT INTO  USERS (userID, userFNAME, userLNAME, userEMAIL, userCLASSES) 
  VALUES ('${USER.uid}', '${USER.givenName}','${USER.sn}','${USER.mail}', '${USER.studentClasses}')`;

  const CREATE_INTEREST_ENTRY = `INSERT INTO INTERESTS VALUES ('${USER.uid}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);`;

  connection.query(
    `${INSERT_USER_QUERY}; ${CREATE_INTEREST_ENTRY}`,
    function (error, results, fields) {
      console.log(USER.uid + " was an issue with adding to the db...");
      if (error) {
        console.log(error)
        return res.status(400).send({
          isError: true,
          result: error.sqlMessage,
        });
      } else {
        console.log(USER.uid + " was added along with the interests!");
        const response = USER.uid + " was added along with interests!";
        return res.status(200).send({
          isError: false,
          result: response,
        });
      }
    }
  );
});

module.exports = router;
