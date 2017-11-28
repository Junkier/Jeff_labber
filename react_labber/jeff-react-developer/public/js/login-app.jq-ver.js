$(function() {
    FB_Init();
});

function FB_Init() {

    // 對 Windows物件 註冊 FB 物件 + 事件
    // 執行 initialize  & getLoginStatus func.
    window.fbAsyncInit = function() {
        FB.init({
            appId: '531374087222278',
            cookie: true,
            xfbml: true,
            version: 'v2.10'
        });
        FB.AppEvents.logPageView();
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/zh_TW/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};


function checkUserStatus(){
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};


function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log("connected");
        // getMemberInfo(response.authResponse);
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log("Please log in our App.");
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log("Status unknown.");
    };
};

function getMemberInfo(initResponse) {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', {
        fields: ["name", "email", "birthday"]
    }, function(response) {
        $("#show_message").html('Thanks for logging in, ' + response.name + '!');
        var payload = Object.assign({},response,{
            access_token : initResponse.accessToken,
            identity : 1   // 先寫定，之後再換成抓動態
        });
        sendMemberPayload(payload)
            .done(function(r){
                var message = {
                    "register ok." : "註冊完成。",
                    "logged in."   : "已登入！"
                }[r.message];
                alert(message);
                // if(r.message === "register ok."){
                //     alert("註冊成功！");
                // };
                location.href = "/users/logined";
            })
            .fail(function(err){
                console.log(err);
                var errMessage;
                if(err.status===400){
                    errMessage = "該會員已註冊，請直接登入、或更換註冊帳號。";
                }else{
                    errMessage = "系統忙碌中，請重新嘗試。";
                }
                alert(errMessage);
            });
    });
};

function sendMemberPayload(p){
    return $.ajax({
        url : "/users/register",
        data: p,
        type: "POST",
        dataType: "json",
        timeout: 10000,
    });
};
