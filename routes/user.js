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
  connection.query(`SELECT * FROM USER WHERE USER_id='${USER_id}';`, function (
    error,
    results,
    fields
  ) {
    //if error or user does not exist in db

    if (error || Object.entries(results).length === 0) {
      console.log("ERROR", error);
      return res.status(400).send({
        isError: true,
        result: error===null?"user not in db":error,
      });
    } else {
      console.log("The solution is: ", results);
      res.status(200).send({
        isError: false,
        result: results,
      });
    }
  });
});

router.route("/addUser").post(async (req, res, next) => {
  console.log("addUser was called");
  const { USER_id, USER_fName, USER_LName, USER_email, USER_sex } = req.body;

  // const INSERT_USER_QUERY = `INSERT INTO  USER (USER_id, USER_fName, USER_LName, USER_email, USER_sex, USER_FIRST_LOGON)
  //                              VALUES ('${USER_id}', '${USER_fName}','${USER_LName}','${USER_email}', '${USER_sex}', 1)`;
  const INSERT_USER_QUERY = `INSERT INTO  USER (USER_id, USER_fName, USER_LName, USER_email, USER_FIRST_LOGON)
  VALUES ('${USER_id}', '${USER_fName}','${USER_LName}','${USER_email}', 1)`;
  connection.query(INSERT_USER_QUERY, function (error, results) {
    if (error)
      return res.status(400).send({
        isError: true,
        result: error.message,
      });
    else {
      console.log(results);
      console.log(USER_fName + " was added!");
      var response = USER_fName + " was added!";
      return res.status(200).send({
        isError: false,
        result: response,
      });
    }
  });
});

module.exports = router;
