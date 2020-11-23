"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");


/**
 * Interaction actions are defined as: 
 * 0= not matched
 * 1= did match
 */

/**
{
    "interactionUSER1":"af027",
    "interactionUSER2":"rghosh",
    "interactionACTION":"1"
}
Means Allison Likes Rashi

{
    "interactionUSER1":"rghosh",
    "interactionUSER2":"af027",
    "interactionACTION":"1"
}
Means Rashi does not like Allison

 */
router.route("/actionInteraction").post(async (req, res, next) => {
    //so param is called USER_id
    const givenInteraction = req.body;





   




  });