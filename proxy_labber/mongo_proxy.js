const http = require("http");
const httpProxy = require("http-proxy");

const port_num = 32888;

var proxy = httpProxy.createProxyServer();
var _proxy_url = "http://192.168.0.47:32777";

console.log(`Proxy ez_pay_mongo to Gptt: ${_proxy_url}`);

http.createServer(function (req, res) {
    proxy.web(req, res, { target: _proxy_url });
    proxy.on('error', function(e) {
        console.log(e);
        res.json({"err":e});
        res.end();
    });
}).listen(port_num);
