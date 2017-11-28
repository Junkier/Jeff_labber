const node_echarts = require('node-echarts');
const fs = require("fs");
const MAPPING_DICT = require("./js/jdict-backend");

var data = {
    "monitor_lights": {
        "vol_time_statistics": {
            "all_volume": {
                "avg": 155.8683333333333,
                "std_deviation": 275.07850893982175,
                "sample": 137
            },
            "pos": {
                "avg": 0.9354838709677419,
                "std_deviation": 2.1542977880082583,
                "sample": 1
            },
            "neg": {
                "avg": 1.4838709677419355,
                "std_deviation": 1.6238339288584798,
                "sample": 1
            }
        }
    },
    "hot_websites": {
        "by_fields": [{
            "rank": 1,
            "field": "forum",
            "doc_cnt": 22
        }, {
            "rank": 2,
            "field": "social_media",
            "doc_cnt": 15
        }],
        "by_catogories": [{
            "rank": 1,
            "field": "forum",
            "website": "ptt",
            "category": "Gossiping",
            "doc_cnt": 1,
            "post_vol_sum": 17.85
        }, {
            "rank": 2,
            "field": "social_media",
            "website": "facebook",
            "category": "蘋果日報",
            "doc_cnt": 1,
            "post_vol_sum": 11.850000000000001
        },{
            "rank": 3,
            "field": "forum",
            "website": "dcard",
            "category": "旅遊",
            "doc_cnt": 1,
            "post_vol_sum": 10.45
        }]
    },
    "semantics": {
        "by_resp_semantic": {
            "pos": 75,
            "neu": 98,
            "neg": 30
        },
        "by_post_semantic": {
            "pos": 15,
            "neg": 7,
            "neu": 17,
            "PN_ratio": 5.2
        }
    },
    "hot_relative_words": {
        "FPtree": [
            {"Level1": "數據", "Level2": "", "word": "柯文哲", "weight": 0.12165669788962871},
            {"Level1": "市府", "Level2": "", "word": "柯文哲", "weight": 0.11691682654327953},
            {"Level1": "答嘴鼓", "Level2": "", "word": "柯文哲", "weight": 0.10766279200993116},
            {"Level1": "指教", "Level2": "", "word": "柯文哲", "weight": 0.10314862882293195},
            {"Level1": "賴香伶", "Level2": "", "word": "柯文哲", "weight": 0.08881616070420946},
            {"Level1": "謝長廷", "Level2": "", "word": "柯文哲", "weight": 0.08847759846518452},
            {"Level1": "財政局", "Level2": "", "word": "柯文哲", "weight": 0.08667193319038483},
            {"Level1": "總預算", "Level2": "", "word": "柯文哲", "weight": 0.08622051687168492},
            {"Level1": "北市府", "Level2": "", "word": "柯文哲", "weight": 0.08588195463265998},
            {"Level1": "修法", "Level2": "", "word": "柯文哲", "weight": 0.08576910055298499}
        ]
    },
    "volume_trends_all": {
        "by_days": {
            "2017-11-04": {
                "doc_cnt": 1,
                "post_vol_sum": 11.85
            },
            "2017-11-05": {
                "doc_cnt": 4,
                "post_vol_sum": 37.424
            },
            "2017-11-06": {
                "doc_cnt": 2,
                "post_vol_sum": 39.55
            },
            "2017-11-07": {
                "doc_cnt": 7,
                "post_vol_sum": 66.44
            }
        }
    },
    "volume_trends_PN": {
        "by_days": {
            "2017-11-04": {
                "doc_cnt": 1,
                "by_post_semantic": {
                    "PN_ratio": 1.22
                }
            },
            "2017-11-05": {
                "doc_cnt": 0,
                "by_post_semantic": {
                    "PN_ratio": 2.1
                }
            },
            "2017-11-06": {
                "doc_cnt": 0,
                "by_post_semantic": {
                    "PN_ratio": 0.75
                }
            },
            "2017-11-07": {
                "doc_cnt": 1,
                "by_post_semantic": {
                    "PN_ratio": 0.94
                }
            }
        }
    }
};

var createOption = {
    monitor_lights : monitorLight,
    hot_websites : hotWebsites,
    semantics : semanticsCircle,
    hot_relative_words : hotRelativeWords,
    volume_trends_all : (function(d){return volumeTrends(d,"all")}),
    volume_trends_PN  : (function(d){return volumeTrends(d,"pnRatio")}),
};

// var sizeOption = {
//     monitor_lights      : {width : 540, height: 300},
//     hot_websites        : {width : 540, height: 300},
//     semantics           : {width : 540, height: 300},
//     hot_relative_words  : {width : 540, height: 300},
//     volume_trends_all   : {width : 540, height: 300},
//     volume_trends_PN    : {width : 540, height: 300},
// };
//

// - 監測燈號 :
function monitorLight(data){

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
                    // saveAsImage: { show: true, title: '保存圖片' }
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
                axisLabel:{
                    fontStyle : "oblique",
                    fontFamily: "Microsoft YaHei",
                    fontSize:16
                },
                title : {
                    offsetCenter: [0, '-120%'],
                    textStyle: {
                        fontSize: 36,
                        // fontFamily: "sans-serif"
                    }
                },
                detail : {
                    offsetCenter: [0, "65%"],
                    textStyle: {
                        fontWeight: 'bolder'
                    },
                    fontSize :40
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
    return option;
};
// - 文章來源 :
function hotWebsites(data){

    var fieldsfie = data["by_fields"].map(function(fieldName){
        return {
            name : MAPPING_DICT.En_2_Zh_Dict[fieldName["field"]],
            value : fieldName["doc_cnt"]
        }
    });

    var catRev = data["by_catogories"]
                            .map(function(catName){
                                var website = MAPPING_DICT.En_2_Zh_Dict[catName.website];
                                var category = catName.website === "ptt" ? MAPPING_DICT.pttCategoryDict[catName.category]:catName.category ;
                                return website +"\n"+category;
                            })
                            .reverse();

    var catSort = data["by_catogories"]
                            .map(function(catValue){
                                return Number(catValue["post_vol_sum"]).toFixed(0)
                            })
                            .sort(function(a,b){ return a- b });


    var option = {
        // backgroundColor: {
        //     type: 'pattern',
        //     repeat: 'repeat'
        // },
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
                    // saveAsImage: { show: true, title: '保存圖片' }
                },
        },
        tooltip: {},
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
    // myChart.hideLoading();
    return option;
};
// - 正負感受 :
function semanticsCircle(data){
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
    // var ap_Chart = echarts.getInstanceByDom(document.getElementById("semantics" + KEYNOTE));

    // $("#keyword" + KEYNOTE + " #originalPosText").empty();
    // $("#keyword" + KEYNOTE + " #originalNegText").empty();
    // $("#keyword" + KEYNOTE + " #originalNeuText").empty();
    // $("#keyword" + KEYNOTE + " #responsePosText").empty();
    // $("#keyword" + KEYNOTE + " #responseNegText").empty();
    // $("#keyword" + KEYNOTE + " #responseNeuText").empty();

    var postPos = data.by_post_semantic.pos;
    var postNeg = data.by_post_semantic.neg;
    var postNeu = data.by_post_semantic.neu;

    var postPosPercent = (postPos/(postPos + postNeg + postNeu)*100).toFixed(2);
    var postNegPercent = (postNeg/(postPos + postNeg + postNeu)*100).toFixed(2);
    var postNeuPercent = (postNeu/(postPos + postNeg + postNeu)*100).toFixed(2);

    var respPos = data.by_resp_semantic.pos
    var respNeg = data.by_resp_semantic.neg
    var respNeu = data.by_resp_semantic.neu

    var respPosPercent = (respPos/(respPos + respNeg + respNeu)*100).toFixed(2);
    var respNegPercent = (respNeg/(respPos + respNeg + respNeu)*100).toFixed(2);
    var respNeuPercent = (respNeu/(respPos + respNeg + respNeu)*100).toFixed(2);

    // 改造改造QQ

    // $("#keyword" + KEYNOTE + " #originalPoslabel").show();
    // $("#keyword" + KEYNOTE + " #originalNeglabel").show();
    // $("#keyword" + KEYNOTE + " #originalNeulabel").show();
    // $("#keyword" + KEYNOTE + " #responsePoslabel").show();
    // $("#keyword" + KEYNOTE + " #responseNeglabel").show();
    // $("#keyword" + KEYNOTE + " #responseNeulabel").show();
    //
    // $("#keyword" + KEYNOTE + " #originalPosText").html('<span>' + postPos + ' / ' + postPosPercent + '%' +'</span>');
    // $("#keyword" + KEYNOTE + " #originalNegText").html('<span>' + postNeg + ' / ' + postNegPercent + '%' +'</span>');
    // $("#keyword" + KEYNOTE + " #originalNeuText").html('<span>' + postNeu + ' / ' + postNeuPercent + '%' +'</span>');
    // $("#keyword" + KEYNOTE + " #responsePosText").html('<span>' + respPos + ' / ' + respPosPercent + '%' +'</span>');
    // $("#keyword" + KEYNOTE + " #responseNegText").html('<span>' + respNeg + ' / ' + respNegPercent + '%' +'</span>');
    // $("#keyword" + KEYNOTE + " #responseNeuText").html('<span>' + respNeu + ' / ' + respNeuPercent + '%' +'</span>');

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
                    // saveAsImage: { show: true, title: '保存圖片' }
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
    // ap_Chart.hideLoading();
    return option;
};
// - 熱門關鍵詞 :
function hotRelativeWords(data){
    var mainData = data["FPtree"].map(function(mainWordsData){
        return {"name": mainWordsData["Level1"],"value":Number((mainWordsData["weight"]).toFixed(2))}
    });

    var option = {
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
                    // saveAsImage: { show: true, title: '保存圖片' }
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
        }
    return option;
};
// - 聲量追蹤-總聲量 or P/N :
function volumeTrends(data,mode){

    var chartId = mode === "all" ? "volumeTrendAll":"volumeTrendPN";

    var days = Object.keys(data["by_days"]);
    var legendType;

    if(mode === "all"){
        var allVolumeData = days.map(d=>data["by_days"][d]["post_vol_sum"].toFixed(0));
        // var allVolumeData = Object.values(data["by_days"]).map(function(allData){
        //     return Number((allData["post_vol_sum"]).toFixed(0))
        // });
        legendType = ["總聲量"];
    } else if (mode === "pnRatio"){
        // chartId = "volumeTrendPN";
        var allVolumeData = days.map(d=>data["by_days"][d]["by_post_semantic"]["PN_ratio"].toFixed(1));
        // var allVolumeData = Object.values(data["by_days"]).map(function(pnData){
        //     return Number((pnData["by_post_semantic"]["PN_ratio"]).toFixed(1))
        // });
        legendType = ["P/N比"];
    };

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
                // saveAsImage: { show: true, title: '保存圖片' }
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
                label: {
                    normal : {
                        show : true,
                        fontSize: 40
                    }
                },
                data: allVolumeData,
                // markPoint: {
                //     symbolSize: 65,
                //     data: [
                //         {type: 'max', name: '最大值'},
                //         {type: 'min', name: '最小值'},
                //         {type: 'average', name: '平均值'},
                //     ]
                // },
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

    return option;
};

var _good_things = Object.keys(createOption).map(key=>{
    return new Promise((resolve,reject)=>{
        var option = createOption[key](data[key]);
        node_echarts({
            path: __dirname + `/img/${key}.png`, //Generate filepath
            option: option, //echarts options
            width: 540, //width Integer
            height: 300 //Height Integer
            // width: sizeOption[key].width, //width Integer
            // height: sizeOption[key].height //Height Integer
        },()=>{
            resolve("done.")
        });
    });
});


Promise.all(_good_things).then(r=>{
    console.log("done.");
    process.exit();
}).catch(err=>{
    console.log(err);
});
