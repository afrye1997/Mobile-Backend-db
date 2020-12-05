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
     * food:lt5
     * hometown: "kc"
     * music: gt5
     * reading: eq4}
     * 
     * lt, gt,eq 
     */
    
});

module.exports = router;
