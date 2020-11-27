"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");
const isAnagram = require("@pelevesque/is-anagram");

/**
 * Interaction actions are defined as:
 * 0= not matched
 * 1= did match
 * 2= block function?
 */

/**
{
    "user1":"af027",
    "user2":"rghosh",
    "action":"likes"
}
Means Allison Likes Rashi


 */

const goodResponse = (res, msg) => {
  return res.status(200).send({
    isError: false,
    result: msg,
  });
};
const badResponse = (res, msg) => {
  return res.status(400).send({
    isError: true,
    result: msg,
  });
};

const output = (result, error) => {
  console.log("Result: ", result);
  console.log("Error: ", error);
};

const updateAction=(actionOnWho, action, interactionID, res)=>{
  const UPDATE_INTERACTION= `UPDATE INTERACTIONS SET ${actionOnWho}="${action}" WHERE interactionID="${interactionID}"`


  connection.query(UPDATE_INTERACTION, async (result,error)=>{
    console.log("updateAction  res: ", result);
    console.log("updateAction err: ", error);
    //alright now we gotta check if there is a match
  })
  isMatch(interactionID, res)
};

const isMatch=(interactionID, res)=>{
  const UPDATE_MATCH_STATUS= `UPDATE INTERACTIONS SET isMatch="yes" WHERE interactionID="${interactionID}"`
  const IS_MATCH= `SELECT user1_likes_user2,user2_likes_user1 FROM INTERACTIONS WHERE interactionID="${interactionID}"`
  connection.query(IS_MATCH, async (error,result)=>{
    if (result[0].user1_likes_user2 ===  result[0].user2_likes_user1){
      //MATCH WAS MADE!!
      connection.query(UPDATE_MATCH_STATUS, async(error, result)=> {
        console.log("YES MATCH, ON GAWD")
        return goodResponse(res,"A MATCHE AS MADE")
      })
    }else{
      return goodResponse(res, "update was made, but no match yet!!")
    }
    //alright now we gotta check if there is a match
  })
}

/**
 * Who likes me?
 * Who have I liked?
 * Who have I disliked?
 *
 *
 * Ex: Allison LIKES Rashi
 *
 * 1) Check anagram, is this combo already in the db?
 *     If yes:
 *        1)check if user1+user2 = post1+post2
 *            if yes, then we know post1 is user1 in the db
 *            if no, then we know post1 is user 2 in the db
 *        2) apply the action
 *        3) check if the like is communicative, if yes, then change isMatched to TRUE
 *    If no:
 *        result will be null
 *        Then we add this combo with the like
 *
 *
 *
 */

router.route("/addInteraction").post(async (req, res, next) => {
  //so param is called USER_id
  //GET ALL THE INTERACTIONS

  const { user1, user2, action } = req.body;
  const primaryKey = user1 + user2;

  const GET_ALL_INTERACTIONS = "SELECT * FROM INTERACTIONS";
  connection.query(GET_ALL_INTERACTIONS, async (error, result) => {
    output(result, error);

    if (result.length === 0) {
      //no entries
      console.log("in if");
      const INSERT_ACTION = `INSERT INTO INTERACTIONS (interactionID, user1, user2, user1_likes_user2, user2_likes_user1, isMatch) VALUES ('${primaryKey}', '${user1}','${user2}','yes','no','no')`;
      connection.query(INSERT_ACTION, async (error, result) => {
        output(error, result);
        goodResponse(res, "added to interaction!!");
      });
    } else {
      console.log("in else");
      output(result, error);
      //loop over the results object
      for (var i = 0; i < result.length; i++) {
        var currID = result[i].interactionID;
        console.log(result[i].user1);
        if (isAnagram(primaryKey, currID)) {
          if (result[i].user1 === user1) {
            //decipher that post.user1 is actually user1 in the db
            console.log("we know user1 is the same as the newly added uses1");
            //now we must do the needed action, update
            updateAction("user1_likes_user2", "yes", currID, res);
          } else {
            //decipher that post.user1 is actually user2 in the db
            console.log("we know user2 is the same as the newly added user1");
            //now we must do the needed action, update
            updateAction("user2_likes_user1", "yes", currID, res);
            console.log(result[i]);
          }
        }
      }

   
    }
  });

});

module.exports = router;

//https://www.programmersought.com/article/9715939690/
