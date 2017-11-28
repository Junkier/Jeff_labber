import { connect } from "react-redux";
import TodoList from "../../components/TodoList/TodoList";

import { deleteTodo } from "../../actions";

const mapStateToProps = (state) => {
    return {
        todos : state.getIn(["todo","todos"])
    }
};


const mapDispatchToProps = (dispatch)=>({
    onDeleteTodo: (index)=>{
        dispatch(deleteTodo({index}));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TodoList);
