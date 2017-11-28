import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Main from "./components/Main";
import store from "./store";

ReactDOM.render(
    <Provider store={store}>
        <Main/>
    </Provider>,
    document.getElementById("app")
);


// 乾 todo & todos 搞不定 ，跑不出來 = =
// 待解QQ
