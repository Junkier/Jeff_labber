$(function(){
    $.ajax({
        url : "/report/happyfan/crawler",
        type : "GET" ,
        dataType : "json",
        timeout : 10000
    })
    .done(function(result){
        genChart(result)
    })
    .fail(function(){

    })
    .always(function(){

    })
})

function genChart(){
    var line_Chart = echarts.getInstanceByDom(document.getElementById("crawlerReport"));
    if (!line_Chart) { line_Chart = echarts.init(document.getElementById("crawlerReport")); };


    var option = {
        title : {
            text :"聲量追蹤",
            left : '0',
            textStyle:{
                fontSize : 18
            }
        },
        color : ['#c23531',"#52a031",'#4fa5a4'] ,
        tooltip: {
            trigger: 'axis',
            formatter: function(params_data) {
                var content = params_data[0]["name"] + "<br>" ;
                params_data.map(function(ele){
                    content += (
                        '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + ele["color"] + '"></span>' +
                        ele["seriesName"] +" : "+ numeral(ele["data"]["value"]).format("0,0") + "<br>"
                    )
                });
                return content;
            }
        },
        legend: {
            data: [],
            width: '70%',
            x: "right",
            top: "0"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top : "15%",
            containLabel: true
        },
        areaStyle: {
            normal: {
                opacity: 0.4,
            }
        },
        lineStyle: {
            normal: {
                opacity: 0.7,
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: [{
            type: 'value'
        }],
        dataZoom: {
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            showDetail: false,
            showDataShadow: false,
        },
        series: [],
    };

    $(window).resize(function() { line_Chart.resize(); });


    line_Chart.clear();
    line_Chart.setOption(option = option)
    line_Chart.hideLoading();
    line_Chart.showLoading();


}
