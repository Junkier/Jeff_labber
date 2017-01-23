$(function(){
    fb_init();
    // FB.getLoginStatus(function(response) {
    //     statusChangeCallback(response);
    // });
    $("#double_check").click(checkLoginState);
    $("#auth_again").click(authorizeAgain);
    $("#fb_data_get").click(getUserFbData);
})

function fb_init(){

     // 對 Windows物件 註冊 FB 物件 + 事件
     // 執行 initialize  & getLoginStatus func.
     window.fbAsyncInit = function() {
         FB.init({
           appId      : '1211949998830552',
           cookie     : true,  // enable cookies to allow the server to access the session
           xfbml      : true,  // parse social plugins on this page
           version    : 'v2.8' // use graph api version 2.8
         });

         // Now that we've initialized the JavaScript SDK, we call
         // FB.getLoginStatus().  This function gets the state of the
         // person visiting this page and can return one of three states to
         // the callback you provide.  They can be:
         //
         // 1. Logged into your app ('connected')
         // 2. Logged into Facebook, but not your app ('not_authorized')
         // 3. Not logged into Facebook and can't tell if they are loggedinto
         //    your app or not.
         //
         // These three cases are handled in the callback function.
         FB.getLoginStatus(function(response){
            statusChangeCallback(response);
         });
     };


     // Load the SDK asynchronously
     (function(d, s, id) {
       var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/zh_TW/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));


     // This is called with the results from from FB.getLoginStatus().
     function statusChangeCallback(response) {
         console.log('statusChangeCallback');
         console.log(response);
         // The response object is returned with a status field that lets the
         // app know the current login status of the person.
         // Full docs on the response object can be found in the documentation
         // for FB.getLoginStatus().
         if (response.status === 'connected') {
           // Logged into your app and Facebook. [已登入FB + 您的APP.]
           // 開始走你寫的 API
           testAPI();
         } else if (response.status === 'not_authorized') {
           // The person is logged into Facebook, but not your app. [已登入FB , 未登入您的APP.]
           document.getElementById('status').innerHTML = 'Please log ' +
             'into this app.';
         } else {
           // The person is not logged into Facebook, so we're not sure if [連FB都沒登入 , FB 無法追蹤他啦~~~]
           // they are logged into this app or not.
           document.getElementById('status').innerHTML = 'Please log ' +
             'into Facebook.';
         }
     }

     // Here we run a very simple test of the Graph API after login is
     // successful.  See statusChangeCallback() for when this call is made.
     function testAPI() {
       console.log('Welcome!  Fetching your information.... ');
       FB.api('/me', function(response) {
           console.log(response);
         console.log('Successful login for: ' + response.name);
         document.getElementById('status').innerHTML =
           'Thanks for logging in, ' + response.name + '!';
       });
     }

}

// 檢查 Login 狀態用 !!!!
function checkLoginState() {
    $("#show_message").text("");
  FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook. [已登入FB + 您的APP.]
        // 開始走你寫的 API
        $("#show_message").text("已登入APP了齁!!!");
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app. [已登入FB , 未登入您的APP.]
        $("#show_message").text("用戶登入FB , 可還沒登入我們的APP.");
      } else {
        // The person is not logged into Facebook, so we're not sure if [連FB都沒登入 , FB 無法追蹤他啦~~~]
        // they are logged into this app or not.
        $("#show_message").text("FB表示: User沒登入，我們也不知道他狀態如何.")
      }
  });
}

function authorizeAgain(){
    FB.login(function(response){
        console.log(response);
    },{
        scope:"email",
        auth_type: "rerequest"  // 授權的 再次提問 config
    });
}

function getUserFbData(){
    $("#show_user_profile").text("");
    // 向 GraphAPI 取 User 資料!!!
    FB.api("/me?fields=name,email,posts.limit(1)",function(res){
        // var content = `[姓名]: ${res.name}\n[FB_ID]: ${res.id}\n[email]: ${res.email}\n[最新FB貼文]:\n${res.posts.data[0]["message"]}`;
        var content = `[姓名]: ${res.name}\n[FB_ID]: ${res.id}\n[email]: ${res.email}\n`;
        $("#show_user_profile").text(content);
    });
}
