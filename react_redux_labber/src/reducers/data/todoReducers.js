import { handleActions } from 'redux-actions';
import { TodoState } from '../../constants/models';
import Immutable from "immutable";

import {
    CREATE_TODO ,
    DELETE_TODO ,
    CHANGE_TEXT
} from "../../constants/actionTypes";

const todoReducers = handleActions({
    CREATE_TODO : (state)=>{
        let todos = state.get("todos").push(state.get("todo"));
        return state.set("todos",todos);
    },
    DELETE_TODO : (state , {payload})=>{
        return state.set("todos", state.get("todos").splice(payload.index,1))
    },
    CHANGE_TEXT : (state,{payload})=>{
        return state.merge(Immutable.fromJS({todo:payload}))
    }
},TodoState);

export default todoReducers;
