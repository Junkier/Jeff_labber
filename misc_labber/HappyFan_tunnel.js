const tunnel = require('tunnel-ssh');
const path = require("path");

let __path = path.join("C:\\Users\\Jeff",".ssh","id_rsa")

// const config = {
//     username:'testQQ',
//     host:"210.242.238.169",
//     port:22,
//     dstHost: "localhost",
//     dstPort:42299,
//     localHost:'localhost',
//     localPort: 42299,
//     privateKey:require('fs').readFileSync(__path),
//     // 幹原來要加這個!!!
//     // 怪怪 , 好像只支援 privateKey 的 login
//     keepAlive:true
// };

const config = {
    username:'testQQ',
    host:"210.242.238.169",
    port:22,
    dstHost: "103.1.221.106",
    dstPort:3306,
    localHost:'192.168.142.200',
    localPort: 6033,
    privateKey:require('fs').readFileSync(__path),
    // 幹原來要加這個!!!
    // 怪怪 , 好像只支援 privateKey 的 login
    keepAlive:true
};


var server = tunnel(config, function (error, server) {
    console.log(`Tunnel [HappyFan DBA]  ${config.localHost}:${config.localPort}  to  ${config.dstHost}:${config.dstPort}`);
});

server.on("error",(err)=>{
    console.log(err);
});
