"use  strict";
const express = require("express");
const router = express.Router();
var connection = require("../connection");


/**
 * Interaction actions are defined as: 
 * 0= not matched
 * 1= did match
 * 2= block function?
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
    const {interactionUSER1, interactionUSER2, interactionACTION} = req.body;
    const INSERT_INTO_INTERACTION= `INSERT INTO INTERACTION(interactionUSER1,interactionUSER2,interactionACTION) VALUES ('${interactionUSER1}', '${interactionUSER2}', '${interactionACTION}')`
    connection.query(INSERT_INTO_INTERACTION, (error, result)=>{
        return res.status(200).send({
            isError:false,
            result:"Interaction added succesfully!"
        })
    })
  });

  

  module.exports = router;