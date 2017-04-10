const express = require('express');
const app = express();

// Import Modules
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const happyfan  = require("./router/happyfan");

const port_num = 51600;


// New Template Engine
app.engine('html',hbs.__express);
app.use(express.static(path.join(__dirname , '/public')));
app.set("views" , path.join(__dirname , "/public"));
app.set("view engine" , "html");

// Setting Trust Network
app.set("trust proxy", "loopback, uniquelocal");

// Setting Middleware
// set limit:"50mb" to control req.body object size.
// set parameterLimit : "10000" to control req.body object term number.
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
		extended : false ,
		limit : "20mb",
		parameterLimit : '10000'
} ) );

app.use(helmet());

app.use("/report/happyfan",happyfan);

app.get("/",function(req,res,next){
    res.render("report");
})

app.listen(port_num,function(){
    // 之後移到 API server.
	console.log(`Report-Server is running at : localhost:${port_num}`);
});
