"use strict";

var QQ = [1, 2, 3, 4, 5, 6];
console.log(QQ.map(function (n) {
    return Math.pow(n, 2);
}));

var SS = new Promise(function (resolve, reject) {
    var name = "Jeff";
    var w1 = "HiHi , I'm " + name;
    (function () {
        console.log(w1);
    })();
});
