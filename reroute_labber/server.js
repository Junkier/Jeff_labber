const express = require('express');
const app = express();

// Import Modules
const cookieParser = require("cookie-parser");

const portNum = 29999;

app.set("trust proxy", "loopback, uniquelocal");

// Use Cookie Parser
// Add secret for signed-cookie
app.use(cookieParser("Hail HydraQQQQ"));

app.get("/",(req,res,next)=>{
    // res.cookie("user_name" , req.body.username , {maxAge :  l_time });
    var words = crypto_helper.encrypt('This is a book.');
    res.cookie('seafood', words , {
        signed: true ,
        httpOnly : true ,
        domain : "localhost",
        // domain : "eyesocial.gptt.com.tw,eyesocial3.insighteye.com.tw,localhost",
        maxAge : 60000
     });
    console.log(req.signedCookies);
    console.log("=".repeat(100));
    // console.log(req.cookies);
    console.log(req.headers)

    res.json({result:req.cookies});
});

app.get("/test-refer",(req,res,next)=>{
    res.redirect("/");
});

app.get("/resolve",(req,res,next)=>{
    var message = req.signedCookies.seafood;
    var word = crypto_helper.decrypt(message);
    res.send(word);
});




/// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).send("Not Found.");
});

app.listen(portNum,function(){
	console.log(`eyeSocial 2.0 test-server is running at : localhost:${portNum}`);
    // console.log(process.env.NODE_ENV);
});
