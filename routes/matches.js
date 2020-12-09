"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");
const fetch = require("node-fetch");
const generatedResponse = require("../globalFunctions.js");
const { response } = require("express");

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

var an_attempt = (user) => {
  return new Promise(function (resolve, reject) {
    const GET_INTERESTS = `SELECT * FROM INTERESTS WHERE interestUSER='${user}'`;
    connection.query(GET_INTERESTS, (error, result) => {
      
      resolve(result);
    });
  });
};

var teacherList=()=>{
  return new Promise(function (resolve, reject) {
    const GET_INTERESTS = `SELECT userID FROM USERS WHERE userSTATUS='faculty' OR userSTATUS='staff';`;
    connection.query(GET_INTERESTS, (error, result) => {
      var teachersStaff=[]
      result.map(user=> teachersStaff.push(user.userID))
      
      resolve(teachersStaff);
    });
  });
}

router.route("/get3RandomMatches").get(async (req, res, next) => {
  //   will have to send the curr user
  //   get the curr user
  var NOT_STUDENT_LIST= await (teacherList())
  console.log("ALLISON", NOT_STUDENT_LIST)
  
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

   
    // result =NOT_STUDENT_LIST.fitler(user=> result.includes(user))
    result= result.map(user=> {
      if(NOT_STUDENT_LIST.includes(user)){
        console.log(user+ "wrong list")
        return "rip"
      }else{
        console.log("all good")
        return user
      }
    }).filter(user=> user!=="rip")
    console.log("result", result);

    generatedResponse.goodResponse(res, shuffle(result));
  });
});

router.route("/getTop3Matches").get(async (req, res, next) => {
  //   will have to send the curr user
  //   get the curr user
  var NOT_STUDENT_LIST= await (teacherList())
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

    const getUserInterests = await fetch(
      `http://mobile-app.ddns.uark.edu/CRUDapis/interest/getInterests?USER_id=${USER_id}`
    )
      .then((response) => response.json())
      .then((data) => Object.values(data));
    console.log("interest list", getUserInterests[1][0]);
    const {
      interestFOOD,
      interestFASHION,
      interestOUTDOORS,
      interestGAMING,
      interestMUSIC,
      interestREADING,
    } = getUserInterests[1][0];
    var dummyObject = {
      interestFOOD: interestFOOD,
      interestFASHION: interestFASHION,
      interestOUTDOORS: interestOUTDOORS,
      interestGAMING: interestGAMING,
      interestMUSIC: interestMUSIC,
      interestREADING: interestREADING,
    };

    // console.log("result", result);

    //NOW THE CHECKING BEGINS

    /**
     * 1/6 (5- (diff in scores)/5) sum up each category!!
     *
     */
    var scores = [];
    for (var i = 0; i < result.length; i++) {
      scores.push(await matchingAlgo(dummyObject, result[i]));
    }

    //list.sort((a, b) => (a.color > b.color) ? 1 : -1)
    scores.sort((a, b) => {
      return b.score - a.score;
    });

    scores= scores.map(user=> user.user)

    scores= scores.map(currUser=> {
      if(NOT_STUDENT_LIST.includes(currUser)){
        console.log(currUser+ "wrong list")
        return "rip"
      }else{
        console.log("all good")
        return currUser
      }
    }).filter(user=> user!=="rip")


    console.log("result", scores);







    generatedResponse.goodResponse(res, scores);
  });

  /**
   * 1/6 (5- (diff in scores)/5) sum up each category!!
   *
   */
});

var boringMath = (currScore, otherScore) => {
  console.log("curr", currScore);
  console.log("other", otherScore);
  console.log((1 / 6) * ((5 - (currScore - otherScore)) / 5));
  return (1 / 6) * ((5 - Math.abs(currScore - otherScore)) / 5);
};

var matchingAlgo = (currUserInterest, otherUser) => {
  return new Promise(function (resolve, reject) {
    const GET_INTERESTS = `SELECT interestFOOD, interestFASHION, interestOUTDOORS, interestGAMING , interestMUSIC, interestREADING FROM INTERESTS WHERE interestUSER='${otherUser}'`;
    connection.query(GET_INTERESTS, (error, result) => {
      const {
        interestFOOD,
        interestFASHION,
        interestOUTDOORS,
        interestGAMING,
        interestMUSIC,
        interestREADING,
      } = currUserInterest;
      var totalScore = 0;
      const currUserProps = Object.values(currUserInterest);
      const otherUserProps = Object.values(result[0]);

      for (var i = 0; i < 6; i++) {
        totalScore += boringMath(currUserProps[i], otherUserProps[i]);
      }
      totalScore += totalScore * 100;
      console.log("result matched with " + otherUser, totalScore);
      var match_and_score = {
        user: otherUser,
        score: totalScore,
      };
      resolve(match_and_score);
    });
  });
};

router.route("/getUsersFromClass").get(async(req,res, next)=>{
  const CLASS= req.query.class;
  var studentsFromTeacher=[]
  var classesList=[]

  const GET_ALL_STUDENTS= "SELECT userID, userCLASSES FROM USERS WHERE userStatus='student';"
  connection.query(GET_ALL_STUDENTS, async(error, result)=>{
    console.log(result)
    studentsFromTeacher= result.map(user=> {
      console.log(user.userID)
      classesList= user.userCLASSES.split(",")
      if(classesList.includes(CLASS)){
        console.log(user.userID+" is in this class!!")
        return (user.userID)
      }
      return "rip"
  }).filter(user=> user!="rip")

 // studentsFromTeacher.filter(user=> user==null)
  console.log(studentsFromTeacher)
  generatedResponse.goodResponse(res, studentsFromTeacher)

})


})


router.route("/filter").post(async (req, res, next) => {

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
