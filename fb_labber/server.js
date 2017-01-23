const express = require('express');
const app = express();

// Import Modules
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const port_num = 55567;

// New Template Engine
app.engine('html',hbs.__express);

// Setting static files root dir.
app.use(express.static(path.join(__dirname,"/public")));

// Setting View engine & View dir
app.set("views" , __dirname);
app.set("view engine" , "html");

// Setting Middleware
// set limit:"50mb" to control req.body object size.
// set parameterLimit : "10000" to control req.body object term number.
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
		extended : false ,
		limit : "20mb",
		parameterLimit : '10000'
} ) );

app.get("/",function(req,res,next){
	res.send("HiHi,I'm FB test.");
})

app.get("/fbLogin",function(req,res,next){
	res.render("login");
})

app.get("/hihi",function(req,res,next){
	res.send("成功!!!!!!!!!");
})

app.listen(port_num,function(){
	console.log(`Server is running at : localhost:${port_num}`);
	// analysis: eyesocial-analy-webserver-svc:8880
});
