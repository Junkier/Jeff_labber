const http = require("http");
const httpProxy = require("http-proxy");

const port_num = 33333;

var proxy = httpProxy.createProxyServer();
var _proxy_url = "http://192.168.0.46:32767";

console.log(`[localhost:${port_num}] Proxy eyeSocial to Gptt: ${_proxy_url}`);

http.createServer(function (req, res) {
    proxy.web(req, res, { target: _proxy_url });
    proxy.on('error', function(e) {
        console.log(e);
        // res.json({"err":e});
        // res.end();
    });
}).listen(port_num);
