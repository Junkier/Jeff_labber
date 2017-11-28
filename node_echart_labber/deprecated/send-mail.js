const nodemailer = require("nodemailer");
const moment = require("moment");
const fs     = require("fs");

let MAIN_SERVER = eyeSocial3_Info.url;
let transporter = nodemailer.createTransport({
    service : "Gmail",
    auth : {
        user : "insightebackend@gmail.com",
        pass : "jeff2017forMail0514QQ"
    }
});

function sendAlertReports(result){
    return new Promise(function(resolve,reject){
        let url = `${MAIN_SERVER}/users/register/auth?uid=${payload.hashId}&auth_token=${payload.auth_token}`;
        let email = payload.email;
        let page = mailer_helper.genRegistry(url,payload.name);

        let mailOption = {
            from : '"eyeSocial [註冊驗證信]" <insightebackend@gmail.com>',
            to   : email,
            subject : `註冊驗證`,
            // html 的 css 好像略吃不到 難搞難搞QQ
            // 1. html 的 css 好像吃不到 = =
            // 2. readFileSync 後 url 寫不進去= =
            //   姑且先不用QQ
            // html : fs.readFileSync("./verification/registry_email.html", 'utf8'),
            html : page,
        };
        transporter.sendMail(mailOption , (err , info)=>{
            if(err){ logger.error(err) ; reject(err)};
            logger.info(`Mailer has sent registry-mail to ${email}.`);
            resolve(info);
        });
    });

    // 從這裡開始!!!
    // 1. 轉 echart
    // 2. send mail
    // 3. ???
    console.log(result);
    return result;
};
