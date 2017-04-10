const request = require("request");

var _DBA_URL = "192.168.142.106:32999";

class Helper{
    constructor(){
        this.getHappyFanReport = function(){
            return new Promise(function(resolve,reject){
        		request.get({
        			url:`http://${_DBA_URL}/report/crawler`,
        			forever:true,   // 忘了這幹嘛的 = =
        			timeout:1800000
        		},function(err, httpResponse, results){
                    results = /^[\[{]|.*|[}\]]$/g.test(results) ? JSON.parse(results):  results;
        			if(err|| httpResponse.statusCode === 500 ){
        				console.log(`[Helper] HappyFan get report get err!!!`);
        				console.log(err);
        				reject(results);
        			};
        			resolve(results);
        		})
        	});
        }
    }
}

module.exports = new Helper();
