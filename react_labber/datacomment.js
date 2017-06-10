var data = [
    {
        id : 1 ,
        author : "Jeff" ,
        comment : "爬山阿阿阿阿阿"
    },
    {
        id : 2,
        author : "Yvonee" ,
        comment : "Special space for someone..."
    }
];
var Comment = React.createClass({
    render : function(){
        return (
            <div className="data_comment">
                ID : {this.props.QQ.id}<br />
                Name : {this.props.QQ.author}<br />
                Comment : {this.props.QQ.comment}<br />
            </div>
        )
    }
});
// 有一個 Component 叫做 CommentBox
var CommentBox = React.createClass({
    render : function(){
        // 這個為 JSX !!!
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                {
                    this.props.data.map(d=>
                        <Comment QQ = {d}/>
                    )
                }
            </div>
        );
    }
});




ReactDOM.render(
    <CommentBox  data = {data}/> ,
    document.getElementById("datacomment")
);