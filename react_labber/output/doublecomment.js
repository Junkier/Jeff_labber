// 父元件  CommentList
var CommentList = React.createClass({
    displayName: "CommentList",

    render: function () {
        return React.createElement(
            "div",
            { className: "commentList" },
            React.createElement(
                Comment,
                { author: "Jeff" },
                " Jeff is good!!! "
            ),
            React.createElement(
                Comment,
                { author: "Apple" },
                " Apple is angry!!! "
            )
        );
    }
});

// 子元件 Comment
var Comment = React.createClass({
    displayName: "Comment",

    render: function () {
        return React.createElement(
            "div",
            { className: "comment" },
            React.createElement(
                "h2",
                { className: "commentAuthor" },
                this.props.author
            ),
            this.props.children
        );
    }
}

// 主頁面
);ReactDOM.render(React.createElement(CommentList, null), document.getElementById("doublecomment")

// 1. Virtual DOM
// 2. Component
);
