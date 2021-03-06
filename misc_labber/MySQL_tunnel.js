const tunnel = require('tunnel-ssh');
const path = require("path");

let __path = path.join("C:\\Users\\Jeff",".ssh","id_rsa")


const config = {
    username:'jeff',
    host:"192.168.142.47",
    port:3798,
    dstHost: "192.168.142.47",
    dstPort:9341,
    localHost:'192.168.1.102',
    localPort: 9341,
    privateKey:require('fs').readFileSync(__path),
    // 幹原來要加這個!!!
    // 怪怪 , 好像只支援 privateKey 的 login
    keepAlive:true
};


var server = tunnel(config, function (error, server) {
    console.log(`Tunnel [Insighteye MySQL]  ${config.localHost}:${config.localPort}  to  ${config.dstHost}:${config.dstPort}`);
});

server.on("error",(err)=>{
    console.log(err);
});
