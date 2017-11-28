import { createAction } from "redux-actions";
import {
    CREATE_TODO,
    DELETE_TODO,
    CHANGE_TEXT
} from "../constants/actionTypes"; // ???

const createTodo = createAction("CREATE_TODO");
const deleteTodo = createAction("DELETE_TODO");
const changeText = createAction("CHANGE_TEXT");

module.exports = {
    createTodo,
    deleteTodo,
    changeText
};
