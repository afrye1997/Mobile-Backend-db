/*
Will hold all CRUD APIs for Users
*/

"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");

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

router.route("/addUser").post(async (req, res, next) => {
  console.log("addUser was called");
  const { USER } = req.body;

  const INSERT_USER_QUERY = `INSERT INTO  USERS (userID, userFNAME, userLNAME, userEMAIL, userCLASSES) 
  VALUES ('${USER.uid}', '${USER.givenName}','${USER.sn}','${USER.mail}', '${USER.studentClasses}')`;

  const CREATE_INTEREST_ENTRY = `INSERT INTO INTERESTS VALUES ('${USER.uid}',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);`;

  connection.query(
    `${INSERT_USER_QUERY}; ${CREATE_INTEREST_ENTRY}`,
    function (error, results, fields) {
      if (error) {
        return res.status(400).send({
          isError: true,
          result: error.message,
        });
      } else {
        console.log(results);
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
