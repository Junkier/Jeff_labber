const crypto = require('crypto');
const SECRET = "jeff-testQQ";

var encrypt = (text)=>{
    text = typeof text === "string" ? text : String(text);
    let cipher = crypto.createCipher("aes-256-cbc",SECRET);
    let crypted = cipher.update(text,"utf8","hex");
    crypted += cipher.final("hex");
    return crypted;
};

var decrypt = (data)=>{
    let decipher = crypto.createDecipher('aes-256-cbc', SECRET);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

var createHashPasswd = (p)=>{
    p = p.toLowerCase();
    return crypto.createHash("sha1")
                 .update(p)
                 .digest("hex");
};


module.exports = {
    encrypt,
    decrypt,
    createHashPasswd,
};
