const fs = require("fs");

let privateKey  = fs.readFileSync("private.pem","utf8"),
    certificate = fs.readFileSync("file.crt","utf8") ,
    credentials = {
        key : privateKey ,
        cert : certificate
    };

module.exports = credentials;
