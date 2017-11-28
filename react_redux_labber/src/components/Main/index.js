import React from "react";
import ReactDOM from "react-dom";
import TodoHeaderContainer from "../../containers/TodoHeaderContainer/TodoHeaderContainer";
import TodoListContainer from "../../containers/TodoListContainer/TodoListContainer";

// Stateless function.
// Stateless component

const Main = ()=>(
    <div>
        <TodoHeaderContainer />
        <TodoListContainer />
    </div>
);

export default Main;
