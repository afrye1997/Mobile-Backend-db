"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");
const fetch = require("node-fetch");
const generatedResponse = require("../globalFunctions.js");
const { UserFlags } = require("discord.js");
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

router.route("/get3RandomMatches").get(async (req, res, next) => {
  //   will have to send the curr user
  //   get the curr user
  const USER_id = req.query.USER_id;
  console.log("entered");
  var getCurrMatches = await fetch(
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

  const whereUser1Liked = `SELECT user2 FROM INTERACTIONS WHERE user1_likes_user2='yes' AND user1='${USER_id}' AND isMatch='no'`;
  connection.query(whereUser1Liked, async (error, result) => {
    user1AlreadyLiked = result.map((x) => getCurrMatches[1].push(x.user2));

    var result = getAllUsers.filter(
      (item) =>
        item !== USER_id &&
        !getCurrMatches[1].some((alreadyMatched) =>
          item.includes(alreadyMatched)
        )
    );

    console.log("result", result);

    generatedResponse.goodResponse(res, shuffle(result));
  });
});

router.route("/getTop3Matches").get(async (req, res, next) => {
  //   will have to send the curr user
  //   get the curr user
  const USER_id = req.query.USER_id;
  console.log("entered");
  var getCurrMatches = await fetch(
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

  const whereUser1Liked = `SELECT user2 FROM INTERACTIONS WHERE user1_likes_user2='yes' AND user1='${USER_id}' AND isMatch='no'`;
  connection.query(whereUser1Liked, async (error, result) => {
    user1AlreadyLiked = result.map((x) => getCurrMatches[1].push(x.user2));

    var result = getAllUsers.filter(
      (item) =>
        item !== USER_id &&
        !getCurrMatches[1].some((alreadyMatched) =>
          item.includes(alreadyMatched)
        )
    );

    //var idk= await an_attempt(result)
    var othersInterests = [];
    for (var i = 0; i < result.length; i++) {
        othersInterests.push(await an_attempt(result[i]));
    }

    console.log("idk", idk);
    console.log("plz be last");

    // console.log("result", result);

    //NOW THE CHECKING BEGINS
    /**
     * 1/6 (5- (diff in scores)/5) sum up each category!!
     *
     */

    generatedResponse.goodResponse(res, shuffle(result));
  });

  /**
   * 1/6 (5- (diff in scores)/5) sum up each category!!
   *
   */
});

var an_attempt = (user) => {
  return new Promise(function (resolve, reject) {
    const GET_INTERESTS = `SELECT * FROM INTERESTS WHERE interestUSER='${user}'`;
    connection.query(GET_INTERESTS, (error, result) => {
      resolve(result);
    });
  });
};

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
