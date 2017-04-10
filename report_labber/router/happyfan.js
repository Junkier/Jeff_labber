const express = require("express");
const _HELPER   = require("../helper");

var router = express.Router();

router.get("/crawler",function(req,res,next){
    _HELPER.getHappyFanReport().then(result=>{
        res.json(result);
    }).catch(err=>{
        console.log(err);
        res.status(404).json({"message":err});
    })
})

module.exports = router;
