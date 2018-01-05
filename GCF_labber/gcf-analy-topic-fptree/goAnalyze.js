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


