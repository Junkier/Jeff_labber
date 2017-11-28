import { connect } from "react-redux";
import TodoHeader from "../../components/TodoHeader/TodoHeader";

import { changeText , createTodo } from "../../actions";

const mapStateToProps = (state) => ({
  // 從 store 取得 todo state
  // todo: state.get('todo')
  todo: state.getIn(['todo','todo'])
});

const mapDispatchToProps = (dispatch)=>({
    onChangeText: (event)=>{
        // dispatch 像 '執行' !!
        dispatch(changeText({
            text : event.target.value
        }));
    },
    onCreateTodo: ()=>{
        dispatch(createTodo());
        dispatch(changeText({text:""}));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoHeader);
