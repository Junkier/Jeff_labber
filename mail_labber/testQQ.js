const nodemailer = require("nodemailer");

// 需至 gmail 寄信的帳號，設定 低安全性開啟
// 用 passwd 可以
// (但我猜應該有 OAuth2.0 的 access key 可以拿)

let transporter = nodemailer.createTransport({
    service:"Gmail",
    auth : {
        type : "OAuth2",
        user : "insightebackend@gmail.com",
        // accessToken : ""
        // pass : ""
    }
});
//
// transporter.set('oauth2_provision_cb', (user, renew, callback)=>{
//     console.log(accessToken);
//     let accessToken = userTokens[user];
//     if(!accessToken){
//         return callback(new Error('Unknown user'));
//     }else{
//         return callback(null, accessToken);
//     }
// });

let mailOption = {
    from : '"node_mail_testQQ" <insightebackend@gmail.com>',
    to   : "logFM3798@gmail.com",
    subject : "測試測試~~~",
    text : "測試啦啦啦啦",
    html : "<h1>幹好想睡覺</h1>"
};

transporter.sendMail(mailOption , (err , info)=>{
    if(err){return console.log(err)}
    console.log(info);
    console.log("Message send.")
});
