const express = require("express");
const http = require("http");
const https = require("https");

const credentials = require("./sslLicense");

var app = express();

let http_port = 52000 , ssl_port = 52031;

var httpServer = http.createServer(app) ,
    httpsServer = https.createServer( credentials , app);

// Http Server
httpServer.listen(http_port , function(){
    console.log(`Http server : localhost:${http_port}`);
});

// Https server
httpsServer.listen(ssl_port , function(){
    console.log(`Https server : localhost:${ssl_port}`);
});


app.get("/",function(req,res,next){
    if(req.protocol === "https"){
        res.send("Https Server 大成功!!!");
    } else{
        res.send("HiHi , 我是 http server!!!");
    }
})
