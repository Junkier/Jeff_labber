$(function() {
    FB_Init();
});

function FB_Init() {

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
        console.log("Do nothing.");
    } else if (response.status === 'unknown') {
        $.ajax({
            url : "/users/logout",
            type: "GET",
            timeout: 10000,
        })
        .done(function(r){
            if(r.message === "logged out."){
                alert("已登出。");
                location.href = "/";
            };
        })
        .fail(function(err){
            console.log(err);
            alert("系統忙碌中，請重新登入。");
            location.href="/";
        });
    };
};
