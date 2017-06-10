// 父元件  CommentList
var CommentList = React.createClass({
    render : function(){
        return (
            <div className="commentList">
                <Comment author="Jeff"> Jeff is good!!! </Comment>
                <Comment author="Apple"> Apple is angry!!! </Comment>
            </div>
        )
    }
});

// 子元件 Comment
var Comment = React.createClass({
    render : function(){
        return (
            <div className = "comment">
                <h2 className = "commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        )
    }
})

// 主頁面
ReactDOM.render(
    <CommentList/>,
    document.getElementById("doublecomment")
)


// 1. Virtual DOM
// 2. Component