var data = [
        {
            "singer" : "蘇打綠",
            "type"   : "獨特樂團",
            "recent_work" : "下雨的夜晚"
        },
        {
            "singer" : "兄弟本色",
            "type"   : "饒舌樂團",
            "recent_work" : "Fly Out"
        },
        {
            "singer" : "李榮浩",
            "type"   : "作曲家",
            "recent_work" : "喜劇之王"
        },
        {
            "singer" : "伍佰老師",
            "type"   : "台客搖滾",
            "recent_work" : "挪威的森林"
        },
        {
            "singer" : "徐佳瑩",
            "type"   : "創作精靈",
            "recent_work" : "莉莉安"
        },
        {
            "singer" : "A-Lin",
            "type"   : "鐵肺歌姬",
            "recent_work" : "P.S 我愛你"
        },
        {
            "singer" : "周杰倫",
            "type"   : "亞洲天王",
            "recent_work" : "不該"
        },
        {
            "singer" : "張惠妹",
            "type"   : "亞洲女王",
            "recent_work" : "姐妹"
        },
        {
            "singer" : "五月天",
            "type"   : "亞洲天團",
            "recent_work" : "派對動物"
        },
        {
            "singer" : "5566",
            "type"   : "經典天團",
            "recent_work" : "我難過"
        }
    ];
    
    
class Singer extends React.Component{
    constructor(props){
        super(props);
        this.stats = {};
    }
    render(){
        return(
             <tr className={this.props.index % 2 === 0 ? "datarowodd": "dataroweven"}>
                <th>{this.props.data.singer}</th>
                <th>{this.props.data.type}</th>
                <th>{this.props.data.recent_work}</th>
            </tr>
        );
    }
}

var TableBox = React.createClass({
    render : function(){
        return (
            <table className='fancytable'>
                <caption style={{textAlign : "center" , color:"blue"}}></caption>
                
                <tbody>
                <tr className ='headerrow'>
                    <th>歌手</th>
                    <th>頭銜</th>
                    <th>最近代表作</th>
                </tr>
                {
                    this.props.data.map((d,index)=>
                        <Singer key = {index} data = {d} index={index}/>
                    )
                }
                </tbody>
            </table>
        )
        
    }
})

ReactDOM.render(
    <TableBox data={data} />,
    document.getElementById("answer")
)