const fs = require("fs");

const PythonShell = require("python-shell");
const moment = require("moment");
const sizeof = require('object-sizeof');

// 1. keyword []
// 2. element { "fptree" : []}

exports.topicFptreeHandler = function (req,res){
    let option = req.body;
    let t_start = new Date();
    if(!option.keywordList){
        res.status(404).send("Lack of keyword!");
    } else if (!option.raw_data) {
        res.status(404).send("Lack of fptree raw data!");
    } else {
        let keyword_list = typeof option.keywordList === "string" ? [option.keywordList] : option.keywordList;

        go_analyze({
            "fp_raw_data": option.raw_data,
            "keyword": keyword_list,
            "query_mode": option.querymode
        }, option.analyzer).then(function(anal_result) {
            console.log("-".repeat(50));
            console.log(`topic fptree ---` +
                ` ${option.keywordList} 【mode : Dashboard , time : ${(new Date() - t_start) / 1000} ` +
                `, byte : ${sizeof(option.raw_data)} , numbers : ${option.raw_data.length}】`
            );
            console.log("-".repeat(50));
            res.json(anal_result);
        }).catch(function(fp_err) {
            console.log(fp_err);
            res.status(500).json({"Err":fp_err.toString()});
        });

    }
}


function go_analyze(a_ele, a_mode) {
    return new Promise(function(resolve, reject) {
        var pyshell = new PythonShell({
            "topics_fptree": '/tools/Topics_for_fptree.py',
            "brands_fptree": '/tools/Brands_for_fptree.py',
            "brands_pmi"   : '/tools/Brands_for_pmi.py'
        }[a_mode], {
            mode: "json"
        });

        // Send data.
        pyshell.send(a_ele);

        // If we get data from .py stdin , then we print it.
        pyshell.on('message', function(message) {
            resolve(message);
        });

        // If we get error from .py stderr , then we print it.
        pyshell.on('error', function(err) {
            reject(err["traceback"]);
        })
    });
};


// Setting trust proxy ip.
// app.set("trust proxy", "loopback, uniquelocal");
// uniquelocal : 子網路

// app.use(bodyParser.json({
//     limit: "50mb",
// }));
//
// app.use(bodyParser.urlencoded({
//     extended: false,
//     limit: "20mb",
//     parameterLimit: '10000'
// }));

// Topic - Fptree
// done.

//
// app.post("/go_analyze/topics_fptree", function(req, res, next) {
//     var t_start = new Date();
//
//     elastic.search_for_topics_fptree(req.body).then(function(es_list) {
//         // [{ ES query 的 data} , { raw_l_tree }];
//
//         var es_result = es_list[0];
//         var l_block_helper = new logic_block_toolbox();
//
//         console.log(`${req.body.keyword} data comes , time : ${(new Date() - t_start)/1000}`);
//
//         var fptree_raw_d = es_result["hits"]["hits"].map(ele => ele["_source"]["content_keywords"] || "");
//         var keyword_list , query_mode;
//
//         // 有進搜 raw_l_tree 有值，否則為 req.body.keyword (砍除()後)
//         if( es_list[1] instanceof Object){
//             // 進搜 mode.
//             var logic_block = l_block_helper.parser(es_list[1]);
//             keyword_list = l_block_helper.decomposer(logic_block);
//             query_mode = l_block_helper.is_sub_ele_string(keyword_list) ? "and" : "or";
//         } else {
//             // 一般 mode.
//             keyword_list = [ es_list[1]];
//             query_mode = "and";
//         }
//
//         go_analyze({
//             "fp_raw_data": fptree_raw_d,
//             "keyword": keyword_list,
//             "query_mode": query_mode
//         }, "topics_fptree").then(function(anal_result) {
//             console.log("-".repeat(50));
//             console.log(`topic fptree ---` +
//                 ` ${req.body.keyword} 【mode : ${req.body.from_chart} , time : ${(new Date() - t_start) / 1000} ` +
//                 `, byte : ${sizeof(fptree_raw_d)} , numbers : ${fptree_raw_d.length}】`
//             );
//             console.log("-".repeat(50));
//
//             res.json(anal_result);
//             l_block_helper=null;
//
//         }).catch(function(fp_err) {
//             console.log(fp_err);
//         });
//
//     }).catch(function(err) {
//         console.log(err);
//         res.status(500).send("you got topics_fptree error!!!");
//     });
//
// });


// Brand - FPtree
// done.
// app.post("/go_analyze/brands_fptree", function(req, res, next) {
//     var t_start = new Date();
//
//     elastic.search_for_brands_fptree(req.body).then(function(es_result) {
//         var fptree_raw_d = es_result["hits"]["hits"].map(ele => ele["_source"]["content_keywords"] || "");
//         console.log(`【${req.body.brand.split(" ")[0]} fptree trigger.】 ${(new Date() - t_start) / 1000}`);
//         go_analyze({
//             "brand": req.body.brand,
//             "mergedQQ": fptree_raw_d
//         }, "brands_fptree").then(function(anal_result) {
//             console.log("-".repeat(50));
//             console.log(`brands fptree ---` +
//                 `【mode : fptree , brand : ${req.body.brand.split(" ")[0]}, time : ${(new Date() - t_start) / 1000} , numbers : ${fptree_raw_d.length}】`
//             );
//             console.log("-".repeat(50));
//             res.json({
//                 "fptree_raw_d": anal_result,
//                 "hotword_raw_d": es_result["aggregations"]
//             });
//         }).catch(function(fp_err) {
//             console.log(fp_err);
//             res.status(500).send("you got brands_fptree error - fptree analysis err. !!!");
//         });
//     })
//     .catch(function(err) {
//         console.log(err);
//         res.status(500).send("you got brands_fptree error - ES query err. !!!");
//     });
// });


// Brand - PMI
// 太難，先不考慮
// app.post("/go_analyze/brands_pmi", function(req, res, next) {
//
//     var query_list = gen_query_list(req.body);
//
//     var t_start = new Date();
//
//     // 之後慢慢移回去吧嗚嗚嗚
//     var promise_all_brands = query_list.map(query => {
//         return new Promise(function(resolve, reject) {
//             var b_n = query["brand"].split(" ")[0];
//             elastic.search_for_brands_pmi(query).then(function(result) {
//                 // [pmi_vol , pmi_word]
//                 resolve({
//                     "b_name": query["brand"],
//                     "aggs_vol": result[0]["aggregations"],
//                     "aggs_pmiwords": result[1]["aggregations"],
//                     "hits_num" : result[1]["hits"]["total"]
//                 });
//             }).catch(function(err) {
//                 console.log(`【Wrong : analysis server - line 252】`);
//                 console.log(err);
//                 reject(b_n + " is err.");
//             })
//         })
//     });
//
//     Promise.all(promise_all_brands).then(function(f_d) {
//         // [p1,p2,p3] => [{..},{..},{..}]
//         console.log(`【brands pmi trigger.】 ${(new Date() - t_start) / 1000}`);
//
//         var L_final_data = {
//             "aggs_by_halfyear": {
//                 "pmi_d": {},
//                 "vol_d": {}
//             },
//             "aggs_by_quarter": {
//                 "pmi_d": {},
//                 "vol_d": {}
//             },
//             "aggs_by_month": {
//                 "pmi_d": {},
//                 "vol_d": {}
//             }
//         };
//
//         var time_dict = {
//             "quarter": get_max_time_list("quarter"),
//             "month": get_max_time_list("month")
//         };
//
//         var month_tag_dict = {
//             "halfyear": {
//                 "01": "01","02": "01","03": "01",
//                 "04": "01","05": "01","06": "01",
//                 "07": "07","08": "07","09": "07",
//                 "10": "07","11": "07","12": "07"
//             },
//             "quarter": {
//                 "01": "01","02": "01","03": "01",
//                 "04": "04","05": "04","06": "04",
//                 "07": "07","08": "07","09": "07",
//                 "10": "10","11": "10","12": "10"
//             }
//         };
//
//         // Vol data 處理
//         f_d.map(b_ele => {
//             var b_n = b_ele["b_name"].split(" ")[0];
//             L_final_data["aggs_by_halfyear"]["vol_d"][b_n] = dealwith_vol_data(b_ele["aggs_vol"]["aggs_by_month"]["buckets"], time_dict["month"], "halfyear");
//             L_final_data["aggs_by_quarter"]["vol_d"][b_n] = dealwith_vol_data(b_ele["aggs_vol"]["aggs_by_quarter"]["buckets"], time_dict["quarter"]);
//             L_final_data["aggs_by_month"]["vol_d"][b_n] = dealwith_vol_data(b_ele["aggs_vol"]["aggs_by_month"]["buckets"], time_dict["month"]);
//         })
//
//         var go_pmi = new Date();
//
//         var pmi_promises = dealwith_pmi_data(f_d, time_dict).map(pmi_t_ready_data =>{
//             // fs.writeFile('testQQ.json', JSON.stringify(pmi_t_ready_data, null, 4));
//             return go_analyze(pmi_t_ready_data, "brands_pmi")
//         });
//
//         Promise.all(pmi_promises).then(function(pmi_good_data) {
//             // [{m} , {q} , {y}]
//             var pmi_time_order = ["aggs_by_month", "aggs_by_quarter", "aggs_by_halfyear"];
//
//             // Fix time list order
//             pmi_good_data.map((p_ele, index) => {
//                 var p_f_data = {};
//                 Object.keys(p_ele).sort((a, b) => new Date(a) - new Date(b)).map(time => {
//                     p_f_data[time] = p_ele[time];
//                 });
//                 L_final_data[pmi_time_order[index]]["pmi_d"] = p_f_data;
//             });
//             console.log(`brands pmi    --- 【mode : pmi , time : ${(new Date() - t_start) / 1000} 】`);
//             res.json(L_final_data);
//         }).catch(function(pmi_err) {
//             console.log(pmi_err);
//             console.log("Pmi_analysis gets error.");
//             res.status(500).json({
//                 "err": pmi_err
//             });
//         });
//
//         // Get the max-time list.
//         function get_max_time_list(care_mode) {
//             var time_paragon = [];
//             f_d.map(b_ele => {
//                 b_ele["aggs_vol"][`aggs_by_${care_mode}`]["buckets"].length > time_paragon.length && function() {
//                     time_paragon = b_ele["aggs_vol"][`aggs_by_${care_mode}`]["buckets"].map(t_ele => t_ele["key_as_string"]);
//                 }();
//             });
//             return time_paragon;
//         }
//
//         function dealwith_vol_data(raw_buckets, t_list, care_mode) {
//             var vol_dict = {}; // 缺項補 0.
//
//             if (care_mode) { // half year.
//                 t_list.map(time => {
//                     var half_y = time.split("-")[0] + "-" + month_tag_dict["halfyear"][time.split("-")[1]];
//                     vol_dict[half_y] = { "vol_num" : 0 , "doc_num" : 0 };
//                 });
//                 raw_buckets.map(t_ele => {
//                     var ele_time = t_ele["key_as_string"].split("-")[0] + "-" + month_tag_dict["halfyear"][t_ele["key_as_string"].split("-")[1]];
//                     vol_dict[ele_time]["vol_num"] += t_ele["volume_sum"]["value"];
//                     vol_dict[ele_time]["doc_num"] += t_ele["doc_count"];
//                 });
//             } else { // quarter & month.
//                 t_list.map(time => {
//                     vol_dict[time] = { "vol_num" : 0 , "doc_num" : 0 };
//                 });
//                 raw_buckets.map(t_ele => {
//                     vol_dict[t_ele["key_as_string"]]["vol_num"] = t_ele["volume_sum"]["value"];
//                     vol_dict[t_ele["key_as_string"]]["doc_num"] = t_ele["doc_count"];
//                 });
//             }
//             return vol_dict;
//         }
//
//
//         function dealwith_pmi_data(raw_data, time_obj) {
//             var merged_data = {
//                 "month": gen_time_obj("month"),
//                 "quarter": gen_time_obj("quarter"),
//                 "halfyear": gen_time_obj("halfyear"),
//             };
//
//             raw_data.map(b_ele => {
//                 b_ele["aggs_pmiwords"]["aggs_by_month"]["buckets"].map(t_ele => {
//                     var sub_ele_lists = t_ele["top_hits"]["hits"]["hits"].map(sub_ele => sub_ele["_source"]["newcontent_tag"] || "");
//                     // halfyear.
//                     var year = t_ele["key_as_string"].split("-")[0],
//                         month = t_ele["key_as_string"].split("-")[1],
//                         halfyear = year + "-" + month_tag_dict["halfyear"][month];
//                     merged_data["halfyear"]["merged_r_d"][halfyear] = merged_data["halfyear"]["merged_r_d"][halfyear].concat(sub_ele_lists);
//
//                     // quarter.
//                     var quarter = year + "-" + month_tag_dict["quarter"][month];
//                     merged_data["quarter"]["merged_r_d"][quarter] = merged_data["quarter"]["merged_r_d"][quarter].concat(sub_ele_lists);
//
//                     // month.
//                     merged_data["month"]["merged_r_d"][t_ele["key_as_string"]] = merged_data["month"]["merged_r_d"][t_ele["key_as_string"]].concat(sub_ele_lists);
//
//                 })
//             })
//
//             Object.keys(merged_data).map(t_name => {
//                 Object.keys(merged_data[t_name]["merged_r_d"]).map(time_detail => {
//                     var unique_post = new Set(merged_data[t_name]["merged_r_d"][time_detail]);
//                     merged_data[t_name]["merged_r_d"][time_detail] = Array.from(unique_post);
//                 });
//             });
//
//             return [merged_data["month"], merged_data["quarter"], merged_data["halfyear"]];
//
//             function gen_time_obj(care_mode) {
//                 var out_obj = {
//                     "merged_r_d": {},
//                     "brands": req.body["brands_what_I_want[]"]
//                 };
//
//                 if (care_mode == "halfyear") {
//                     // half_year
//                     time_obj["month"].map(time => {
//                         var half_y = time.split("-")[0] + "-" + month_tag_dict["halfyear"][time.split("-")[1]];
//                         out_obj["merged_r_d"][half_y] = [];
//                     });
//                 } else {
//                     // quarter & month
//                     time_obj[care_mode].map(time => {
//                         out_obj["merged_r_d"][time] = [];
//                     })
//                 }
//                 return out_obj;
//             }
//         }
//
//     }).catch(function(pmi_etl_err) {
//         console.log(pmi_etl_err);
//         console.log("PMI_ETL gets error.");
//         res.status(500).json({
//             "err": pmi_etl_err
//         });
//     })
// });


// app.listen(32777, function() {
//     console.log("Analysis server is running at : localhost:32777");
// });
