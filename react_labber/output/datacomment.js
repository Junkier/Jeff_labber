var data = [{
    id: 1,
    author: "Jeff",
    comment: "爬山阿阿阿阿阿"
}, {
    id: 2,
    author: "Yvonee",
    comment: "Special space for someone..."
}];
var Comment = React.createClass({
    displayName: "Comment",

    render: function () {
        return React.createElement(
            "div",
            { className: "data_comment" },
            "ID : ",
            this.props.QQ.id,
            React.createElement("br", null),
            "Name : ",
            this.props.QQ.author,
            React.createElement("br", null),
            "Comment : ",
            this.props.QQ.comment,
            React.createElement("br", null)
        );
    }
});
// 有一個 Component 叫做 CommentBox
var CommentBox = React.createClass({
    displayName: "CommentBox",

    render: function () {
        // 這個為 JSX !!!
        return React.createElement(
            "div",
            { className: "commentBox" },
            React.createElement(
                "h1",
                null,
                "Comments"
            ),
            this.props.data.map(d => React.createElement(Comment, { QQ: d }))
        );
    }
});

ReactDOM.render(React.createElement(CommentBox, { data: data }), document.getElementById("datacomment"));
