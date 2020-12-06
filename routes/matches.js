"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");
const fetch = require("node-fetch");
const generatedResponse = require("../globalFunctions.js");
/**
 * 1/6 (5- (diff in scores)/5) sum up each category!!
 *
 */

//get some top matches
/**
 * 1) get all the ppl in the db
 * 2) do all the matching
 * 3) then return top 3 matches
 */

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

var matches = async (USER_id) => {
  console.log("entered");
  const getCurrMatches = await fetch(
    `http://mobile-app.ddns.uark.edu/CRUDapis/interaction/getMatches?USER_id=${USER_id}`
  )
    .then((response) => response.json())
    .then((data) => Object.values(data));

  console.log("get curr matches", getCurrMatches[1]);

  const getAllUsers = await fetch(
    "http://mobile-app.ddns.uark.edu/CRUDapis/users/getAllUsers"
  )
    .then((response) => response.json())
    .then((data) => data.result.map((user) => user.userID));
  console.log("get all users", getAllUsers);

  var result = getAllUsers.filter(
    (item) =>
      item !== USER_id &&
      !getCurrMatches[1].some((alreadyMatched) => item.includes(alreadyMatched))
  );
  return shuffle(result);
};

router.route("/get3RandomMatches").get(async (req, res, next) => {
  //will have to send the curr user
  //get the curr user
  const USER_id = req.query.USER_id;
  matches(USER_id).then((data) => generatedResponse.goodResponse(res, data));
});

router.route("/getTop3Matches").get(async (req, res, next) => {
  //will have to send the curr user
});

router.route("/filter").post(async (req, res, next) => {
  /**
   * {
   * user: af027,
   * food:5
   * hometown: "kc"
   * music: 5
   * reading: 4}
   *
   * lt, gt,eq
   */
  var filteredArray = [];
  const userTableFields = [
    "userHOMETOWN",
    "userGENDER",
    "userGRADE_LEVEL",
    "userGRAD_DATE",
    "userPROGRAM_EXP",
    "userSTATUS",
  ];
  const interestTableFields = [
    "interestFOOD",
    "interestFASHION",
    "interestOUTDOORS",
    "interestGAMING",
    "interestMUSIC",
    "interestREADING",
  ];
  const filterValues = req.body;

  for (column in filterValues) {
    var value = filterValues[column];
    console.log(value);
    console.log(column);
    if (userTableFields.includes(column)) {
      console.log("in user table");
      filteredArray.push("u." + column + "=" + "'" + value + "'");
    }
    if (interestTableFields.includes(column)) {
      console.log("in interest");
      filteredArray.push("i." + column + "=" + "'" + value + "'");
    }
  }

  console.log("filtered", filteredArray);
  var AND = "";
  for (var i = 0; i < filteredArray.length; i++) {
    AND += filteredArray[i] + " AND ";
  }
  AND = AND.slice(0, -5);

  const FILTER_QUERY = `SELECT * FROM USERS u INNER JOIN INTERESTS i ON u.userID=i.interestUSER WHERE ${AND}`;
  connection.query(FILTER_QUERY, (error, result) => {
    console.log(result);
    if (result.length === 0) {
      generatedResponse.goodResponse(res, "no matches, empty array");
    } else {
      generatedResponse.goodResponse(res, result);
    }
    if (error) {
      generatedResponse.badResponse(res, error);
    }
  });
});

module.exports = router;
