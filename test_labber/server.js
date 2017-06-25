const express = require("express");
const port = process.env.PORT || 3000;
var app = express();

var axios = require("axios");


app.get("/",(req,res,next)=>{
    res.status(404).json({"error":"Page not found."})
})

app.get("/latlng",(req,res,next)=>{
    if(req.query.address){
        next();
    }else{
        res.status(400).json({"error":"lack of address"});
    };
} , (req,res,next)=>{
    let encodeAddress = encodeURIComponent(req.query.address);
    let google_api = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;
    axios.get(google_api)
          .then(function (response) {
              res.json(response.data["results"][0]["geometry"]["location"]);
          })
          .catch(function (error) {
            res.status(404).json({"error":'Unable to find that address'});
            console.log(error);
          });
});


app.listen(port , ()=>{
    console.log(`Server is listening : ${port}`);
})

module.exports.app = app;
