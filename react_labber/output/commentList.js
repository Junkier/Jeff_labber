var CommentList = React.createClass({
    displayName: "CommentList",

    render: function () {
        return React.createElement(
            "div",
            { className: "commentList" },
            "HiHi!!! I'm commentList."
        );
    }
});

var CommentForm = React.createClass({
    displayName: "CommentForm",

    render: function () {
        return React.createElement(
            "div",
            { className: "commentForm" },
            "HiHi!!! I'm commentForm."
        );
    }
});

// 這是 元件 !!!
var CommentBox = React.createClass({
    displayName: "CommentBox",

    render: function () {
        return React.createElement(
            "div",
            { className: "commentBox" },
            React.createElement(CommentList, null),
            React.createElement(CommentForm, null)
        );
    }
});

ReactDOM.render(React.createElement(CommentBox, null), document.getElementById("commentList"));
