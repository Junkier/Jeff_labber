var DivMap = React.createClass({
    render : function(){
        return(
            <div id='map'/>
        )
    }
})

ReactDOM.render(
    <DivMap/>,
    document.getElementById('qualityLive_map')
)
