var CommentList = React.createClass({
    render : function(){
        return (
            <div className = "commentList">
                HiHi!!! I'm commentList.
            </div>
        )
    }
});

var CommentForm = React.createClass({
    render : function(){
        return (
            <div className = "commentForm">
                HiHi!!! I'm commentForm.
            </div>
        )
    }
});


// 這是 元件 !!!
var CommentBox = React.createClass({
   render : function(){
       return (
            <div className="commentBox">
                <CommentList />
                <CommentForm />
            </div>
       );
   } 
});



ReactDOM.render(
    <CommentBox />,
    document.getElementById("commentList")
);