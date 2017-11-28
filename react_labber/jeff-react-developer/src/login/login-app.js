import React , { Component }  from 'react';

class LoginApp extends Component{
    componentWillMount () {
        const script = document.createElement("script");
        script.src = "js/login-app.jq-ver.js";
        script.async = true;
        document.body.appendChild(script);
    };

    render(){
        return(
            <div className="main">
                <div id="fb-root"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="testLogin">
                            <div className="fb-login-button" onlogin="checkUserStatus()"  data-max-rows="1" data-size="medium" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="true" data-use-continue-as="true"></div>
                        </div>
                        <div id="jeff_message" styles={{"padding":"10px"}}>
                            <button className="btn btn-info" id="double_check" >狀態確認</button>
                            <textarea id="show_message" disabled></textarea>
                        </div>
                        <div styles={{"padding":"10px"}}>
                            <button className="btn btn-info"  id="auth_again" >授權2.0</button>
                            <textarea id="show_message_again" disabled></textarea>
                        </div>
                        <input type="text" value="{{user}}"/>
                    </div>
                </div>
            </div>
        );
    }
};

export default LoginApp;
