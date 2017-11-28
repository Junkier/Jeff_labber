// - 監測燈號 :
function monitorLight(data){

    var myChart = echarts.getInstanceByDom(document.getElementById("monitorLights" + KEYNOTE));

    if (!data["vol_time_statistics"]){
        $("#monitorLights"  + KEYNOTE ).html('<p>' +  '本次搜尋無資料' + '</p>')
        return;
    };


    var allStd = Number(data["vol_time_statistics"]["all_volume"]["std_deviation"]).toFixed(0);
    var posStd = Number(data["vol_time_statistics"]["pos"]["std_deviation"]).toFixed(0);
    var negStd = Number(data["vol_time_statistics"]["neg"]["std_deviation"]).toFixed(0);

    var allSam = Number(data["vol_time_statistics"]["all_volume"]["sample"]).toFixed(0);
    var posSam = Number(data["vol_time_statistics"]["pos"]["sample"]).toFixed(0);
    var negSam = Number(data["vol_time_statistics"]["neg"]["sample"]).toFixed(0);

    var option = {
        toolbox : {
            right: "5%",
            show: true,
            feature: {
                    mark: { show: false },
                    dataView: { show: false, readOnly: false },
                    magicType: {
                        show: false,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: false },
                    saveAsImage: { show: true, title: '保存圖片' }
                },
        },
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        series : [
            {
                name: '總聲量',
                type: 'gauge',
                z: 3,
                min: 0,
                max: allStd*3,
                splitNumber: 3,
                radius: '60%',
                axisLine: {
                    lineStyle: {
                        width: 10
                    }
                },
                axisTick: {
                    length: 15,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                title : {
                    offsetCenter: [0, '-120%'],
                    textStyle: {
                        fontSize: 20,
                    }
                },
                detail : {
                    offsetCenter: [0, "65%"],
                    textStyle: {
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: allSam, name: '總聲量'}]
            },
            {
                name: '負聲量',
                type: 'gauge',
                center: ['20%', '55%'],
                radius: '45%',
                min:0,
                max:negStd*3,
                endAngle:45,
                splitNumber:3,
                axisLine: {
                    lineStyle: {
                        width: 8
                    }
                },
                axisTick: {
                    length:12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length:20,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-120%'],
                },
                detail: {
                    textStyle: {
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: negSam, name: '負聲量'}]
            },
            {
                name: '正聲量',
                type: 'gauge',
                center: ['80%', '55%'],
                radius: '45%',
                min:0,
                max:posStd*3,
                startAngle: 135,
                endAngle: -45,
                splitNumber:3,
                axisLine: {
                    lineStyle: {
                        width: 8
                    }
                },
                axisTick: {
                    length:12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length:20,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    width:5
                },
                title: {
                    offsetCenter: [0, '-120%'],
                },
                detail: {
                    textStyle: {
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: posSam, name: '正聲量'}]
            }
        ]
    };

    myChart.hideLoading();
    myChart.setOption(option);
};

// - 文章來源 :
function hotWebsites(data){

    var myChart = echarts.getInstanceByDom(document.getElementById("hotWebsites" + KEYNOTE));

    if (!data["by_fields"]){
        $("#hotWebsites"  + KEYNOTE ).html('<p>' +  '本次搜尋無資料' + '</p>')
        return;
    };

    var fieldsfie = data["by_fields"].map(function(fieldName){
        return {
            name : fieldName["field"],
            value : fieldName["doc_cnt"]
        }
    });

    var catRev = data["by_catogories"]
                            .map(function(catName){
                                return catName["website"] + "\n" + catName["category"]

                            })
                            .reverse();

    var catSort = data["by_catogories"]
                            .map(function(catValue){
                                return Number(catValue["post_vol_sum"]).toFixed(0)
                            })
                            .sort(function(a,b){ return a- b });


    var option = {
        backgroundColor: {
            type: 'pattern',
            repeat: 'repeat'
        },
        toolbox : {
            right: "5%",
            show: true,
            feature: {
                    mark: { show: false },
                    dataView: { show: false, readOnly: false },
                    magicType: {
                        show: false,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: false },
                    saveAsImage: { show: true, title: '保存圖片' }
                },
        },
        tooltip: {
        },
        title: [{
            text: '熱門頻道',
            x: '27%',
            y: '5%',
            textAlign: 'center'
        }, {
            text: '陣地佔比',
            x: '70%',
            y: '5%',
            textAlign: 'center'
        }],
        grid: [{
            top: 50,
            width: '43%',
            height: '70%',
            bottom: '45%',
            left: 10,
            containLabel: true
        }],
        xAxis: [{
            // type: 'value',
            axisTick: {
                show: false,
            },
            splitNumber: 0,
            axisLabel: {
                show:false,
            },
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'category',
            data: catRev,
            axisTick: {
                show: false,
            },
            axisLabel: {

                interval: false,
                // rotate: 30
            },
            splitLine: {
                show: false
            }
        }],
        series: [{
            type: 'bar',
            stack: 'chart',
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            tooltip: {
                formatter :function(barele){
                    return '總聲量' +  " : " + numeral(barele["data"]).format("0,0")
                 }
            },
            data: catSort,
        }
        , {
            type: 'pie',
            label: {
                normal: {
                    formatter:  '{b}\n文章數 : {c}',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            radius: [0, '40%'],
            center: ['70%', '53%'],
            tooltip: {
                formatter :function(ele){
                    return '文章數' +  " : " + ele["data"]["value"]
                 }
            },
            data: fieldsfie,
        }]
    }
    myChart.hideLoading();
    myChart.setOption(option);
};
// - 正負感受 :
function semanticsCircle(data){
    console.log(data)
    if (!data["by_resp_semantic"] || !data["by_post_semantic"]){
        $("#semantics"  + KEYNOTE ).html('<p>' +  '本次搜尋無資料' + '</p>')
        return;
    };

    var en2zh = {
        "pos" : "正面",
        "neu" : "中立",
        "neg" : "負面"
    };

    var posColor = '#f9c141' ;

    var negColor = '#ee5249';
    // var negColor = '#5cb85c';


    var neuColor = '#c7c7c7';
    // var neuColor = '#ee5249';


    var resp_semantic = Object.keys(data["by_resp_semantic"]).map(function(respTag){
        return {
            "value" : data['by_resp_semantic'][respTag],
            "name" : en2zh[respTag],
            "itemStyle" : {
                normal: {
                    color: en2zh[respTag] === '正面' ? posColor : ( en2zh[respTag] === '負面' ? negColor : neuColor)
                }
            }
        }
    });

    var post_semantic = ["neg","neu","pos"].map(function(semanticTag){
        return {
            "value" : data["by_post_semantic"][semanticTag],
            "name" : en2zh[semanticTag],
            "itemStyle" : {
                normal: {
                    color: en2zh[semanticTag] === '正面' ? posColor : ( en2zh[semanticTag] === '負面' ? negColor : neuColor)
                }
            }
        }
    });
    var ap_Chart = echarts.getInstanceByDom(document.getElementById("semantics" + KEYNOTE));

    $("#keyword" + KEYNOTE + " #originalPosText").empty();
    $("#keyword" + KEYNOTE + " #originalNegText").empty();
    $("#keyword" + KEYNOTE + " #originalNeuText").empty();
    $("#keyword" + KEYNOTE + " #responsePosText").empty();
    $("#keyword" + KEYNOTE + " #responseNegText").empty();
    $("#keyword" + KEYNOTE + " #responseNeuText").empty();

    var postPos = data.by_post_semantic.pos
    var postNeg = data.by_post_semantic.neg
    var postNeu = data.by_post_semantic.neu

    var postPosPercent = (postPos/(postPos + postNeg + postNeu)*100).toFixed(2);
    var postNegPercent = (postNeg/(postPos + postNeg + postNeu)*100).toFixed(2);
    var postNeuPercent = (postNeu/(postPos + postNeg + postNeu)*100).toFixed(2);

    var respPos = data.by_resp_semantic.pos
    var respNeg = data.by_resp_semantic.neg
    var respNeu = data.by_resp_semantic.neu

    var respPosPercent = (respPos/(respPos + respNeg + respNeu)*100).toFixed(2);
    var respNegPercent = (respNeg/(respPos + respNeg + respNeu)*100).toFixed(2);
    var respNeuPercent = (respNeu/(respPos + respNeg + respNeu)*100).toFixed(2);

    $("#keyword" + KEYNOTE + " #originalPoslabel").show();
    $("#keyword" + KEYNOTE + " #originalNeglabel").show();
    $("#keyword" + KEYNOTE + " #originalNeulabel").show();
    $("#keyword" + KEYNOTE + " #responsePoslabel").show();
    $("#keyword" + KEYNOTE + " #responseNeglabel").show();
    $("#keyword" + KEYNOTE + " #responseNeulabel").show();

    $("#keyword" + KEYNOTE + " #originalPosText").html('<span>' + postPos + ' / ' + postPosPercent + '%' +'</span>');
    $("#keyword" + KEYNOTE + " #originalNegText").html('<span>' + postNeg + ' / ' + postNegPercent + '%' +'</span>');
    $("#keyword" + KEYNOTE + " #originalNeuText").html('<span>' + postNeu + ' / ' + postNeuPercent + '%' +'</span>');
    $("#keyword" + KEYNOTE + " #responsePosText").html('<span>' + respPos + ' / ' + respPosPercent + '%' +'</span>');
    $("#keyword" + KEYNOTE + " #responseNegText").html('<span>' + respNeg + ' / ' + respNegPercent + '%' +'</span>');
    $("#keyword" + KEYNOTE + " #responseNeuText").html('<span>' + respNeu + ' / ' + respNeuPercent + '%' +'</span>');

    var option = {
        title : [{
            text: '正 文',
            top: '46%',
            left: '31%',
            textStyle: {
                color: '#adabab',
            }
        },{
            text: '回 文',
            top: '46%',
            left: '59%',
            textStyle: {
                color: '#adabab',
            }
        }],
        tooltip : {
            trigger: 'item',
            formatter : function(ele){
                return ele["seriesName"] + "<br>" + ele["data"]["name"] +  " : "
                    + numeral(ele["data"]["value"]).format("0,0") + "&nbsp" +"(" + ele["percent"].toFixed(2)
                    + "%)" ;
            }
        },
        legend: {
            x : 8,
            y : 3,
            data: [{
                    name: "正面",
                    textStyle: {
                        color: posColor,
                        fontFamily: '_FONT_FAMILY'
                    }
                }, {
                    name: "負面",
                    textStyle: {
                        color: negColor,
                        fontFamily: '_FONT_FAMILY'
                    }
                }, {
                    name: "中立",
                    textStyle: {
                        color: neuColor,
                        fontFamily: '_FONT_FAMILY'
                    }
                }]

        },
        toolbox: {
                right: "5%",
                show: true,
                feature: {
                    mark: { show: false },
                    dataView: { show: false, readOnly: false },
                    magicType: {
                        show: false,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: false },
                    saveAsImage: { show: true, title: '保存圖片' }
                },
            },
        calculable : true,
        series : [{
            name:'正文',
            type:'pie',
            labelLine: {
                normal: {
                    show: false,
                    // length: '1',
                    }
            },
            label: {
                show: false,
                normal:{
                    show: false
                }
                // align: 'center',
                // normal:{
                //     formatter: '{b} : {c} ({d}%)',
                //     fontWeight:300,
                //     align: 'center',
                // }
        },
            radius : [33, 70],
            center : ['36%', '50%'],
            // roseType : 'radius',
            // roseType : 'area',
            data : post_semantic,
        },{
            name:'回文',
            type:'pie',
            clockwise: false,
            labelLine: {
                normal: {
                    show: false,
                    position: 'inside',
                    }
            },
            label: {
                show: false,
                normal:{
                    show: false
                }
                // normal:{
                //     formatter: '{b} : {c} ({d}%)'
                // }
            },
            radius : [33, 70],
            center : ['64%', '50%'],
            // roseType : 'radius',
            // roseType : 'area',
            data:resp_semantic
            }
        ]
    };
    ap_Chart.hideLoading();
    ap_Chart.setOption(option);

};
// - 熱門關鍵詞 :
function hotRelativeWords(data){

    if (!data["FPtree"]){
        $("#hotRelativeWord"  + KEYNOTE ).html('<p>' +  '找不到相關關鍵詞' + '</p>');
        return;
    };

    var myChart = echarts.getInstanceByDom(document.getElementById("hotRelativeWord" + KEYNOTE));


    var mainData = data["FPtree"].map(function(mainWordsData){
        return {"name": mainWordsData["Level1"],"value":Number((mainWordsData["weight"]).toFixed(2))}
    });

    myChart.hideLoading();
    myChart.setOption(option={
            title: {
                text: '',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                formatter : function(ele){
                    return "關鍵詞 : " + ele["data"]["name"] +"<br>" +  " 相關度 : " + ele["data"]["value"] ;
                }
            },
            toolbox: {
            right: "5%",
            show: true,
            feature: {
                    mark: { show: false },
                    dataView: { show: false, readOnly: false },
                    magicType: {
                        show: false,
                        type: ['pie', 'funnel']
                    },
                    restore: { show: false },
                    saveAsImage: { show: true, title: '保存圖片' }
                },
            },
            series: [{
                type: 'treemap',
                visibleMin: 300,
                data : mainData,
                silent: true,
                // leafDepth: 2,
                roam : false,
                levels: [
                    {
                        itemStyle: {
                            normal: {
                                borderColor: 'white',
                                borderWidth: 4,
                                gapWidth: 4
                            }
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.6],
                        itemStyle: {
                            normal: {
                                borderColorSaturation: 0.7,
                                gapWidth: 2,
                                borderWidth: 2
                            }
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.5],
                        itemStyle: {
                            normal: {
                                borderColorSaturation: 0.6,
                                gapWidth: 1
                            }
                        }
                    },
                    {
                        colorSaturation: [0.3, 0.5]
                    }
                ],
                breadcrumb: {
                    show: false
                },
            }]
        })

};
// - 聲量追蹤-總聲量 or P/N :
function volumeTrends(data,mode){

    var chartId = mode === "all" ? "volumeTrendAll":"volumeTrendPN";

    if (!data["by_days"]){
        $("#" + chartId + KEYNOTE).html('<p>' +  '本次搜尋無資料' + '</p>');
        return;
    };

    var days = Object.keys(data["by_days"]);
    var legendType;



    if(mode === "all"){
        var allVolumeData = Object.values(data["by_days"]).map(function(allData){
            return Number((allData["post_vol_sum"]).toFixed(0))
        });
        legendType = ["總聲量"];
    } else if (mode === "pnRatio"){
        // chartId = "volumeTrendPN";
        var allVolumeData = Object.values(data["by_days"]).map(function(pnData){
            return Number((pnData["by_post_semantic"]["PN_ratio"]).toFixed(1))
        });
        legendType = ["P/N比"];
    };

    var all_Chart = echarts.getInstanceByDom(document.getElementById(chartId + KEYNOTE));

    var option = {
        title: {
            text: '',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data : legendType,
            right : '10%',
        },
        toolbox: {
            right: "5%",
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: {
                    show: false,
                    type: ['pie', 'funnel']
                },
                restore: { show: false },
                saveAsImage: { show: true, title: '保存圖片' }
            },
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: days
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: legendType,
                type:'line',
                // sampling:'max',
                data: allVolumeData,
                markPoint: {
                    // label:{
                    //     normal:{
                    //          formatter : function(ele){
                    //              return "關鍵詞 : "+ ele["data"][days]  ;}
                    //     }
                    // },
                    symbolSize: 65,
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'},
                        {type: 'average', name: '平均值'},
                    ]
                },
                markLine: {
                    // label:{
                    //     normal:{
                    //         formatter : function(ele){
                    //              return "最大值 : "+ ele["data"] ;},
                    //         position: 'middle',
                    //     }
                    // },
                    data: [
                        // {type: 'average', name: '平均值'},
                        // {type: 'max', name: '最大值'},
                        // {type: 'min', name: '最小值'}
                        // {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最大值'
                            }
                        },
                        type: 'max',
                        name: '最大值'
                    }],[{
                        symbol: 'none',
                        x: '91%',
                        yAxis: 'min'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最小值'
                            }
                        },
                        type: 'min',
                        name: '最小值'
                    }],[{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'average'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '平均值'
                            }
                        },
                        type: 'average',
                        name: '平均值'
                    }]
                    ]
                }
            },
        ]
    };
    all_Chart.hideLoading();
    all_Chart.setOption(option);
};

// 文章列表
// 需打文列的 API
function createTable(data,rankParam){

    var place = "#keyword" + KEYNOTE + " #" + rankParam + "SortTab" + KEYNOTE + " tbody" ;

    if (data.result.articles.length === 0){
        $("table tbody").html('<p>'+ '本次搜尋無資料' + '</p>')
    }
    // From jsdk.js
    createArticlesTable({
        data  : data.result.articles,
        place : place,
        order : ["time","title","author","field","website","volume","semantic"]
    });

};

// function chartShower(){
//     return {
//         monitor_lights : monitorLight,
//         hot_websites : hotWebsites,
//         semantics : semanticsCircle,
//         hot_relative_words : hotRelativeWords,
//         volume_trends_all : (function(d){volumeTrends(d,"all")}),
//         volume_trends_PN  : (function(d){volumeTrends(d,"pnRatio")}),
//     }
// }

module.exports = {
    monitorLight,
    hotWebsites,
    semanticsCircle,
    hotRelativeWords,
    volumeTrends
};
