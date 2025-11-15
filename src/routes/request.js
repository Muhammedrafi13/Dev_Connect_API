const express = require("express");
const router = express.Router();

router.get("/request",(req,res)=>{
      try {

        res.send("request is sendnig back");


    } catch (err) {
        res.status(400).send("Error" + err.message);
    }
})

module.exports = router;