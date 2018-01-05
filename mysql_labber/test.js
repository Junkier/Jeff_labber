const mysql = require("mysql");

var dbConfig = {
    connectionLimit : 10,
    host : "192.168.142.47",
    port : 9341,
    user : "eyesocial",
    password : "jeffandapple",
    database : "eyesocial",
    multipleStatements : true,
};


var pools = mysql.createPool(dbConfig);

var testQQ = ()=>{
    return new Promise((resolve,reject)=>{
        pools.getConnection((err,client)=>{
            let q = "Select * FROM members WHERE memNo = 1001000;";
            if(err){ console.log(err); reject("Mysql connection error."); return;};
            client.query(q,(error,results,field)=>{
                if(error){console.log(error); reject({"err":error})};
                resolve(results);
                client.release();
            })
        })
    });
};

testQQ()
    .then(r=>{
        console.log(r);
        process.exit();
    })
    .catch(err=>{
        console.log(err);
    });
