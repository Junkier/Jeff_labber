const sizeof = require('object-sizeof');

// 幹 ProtoType 的型式難寫難寫 = =
// sizeof.prototype.transformUnitTo = function(mode){
//     var result = {
//         "Byte" : sizeof(),
//         "KB"   : ,
//         "MB"   : ,
//         "GB"   : ,
//     }[mode]();
//     return sizeof()
// }


function sizeCounter(obj,mode){
    var unitTransfrom = {
        "B"    : (n)=> `${n} B`,
        "KB"   : (n)=> `${(n/1024).toFixed(2)} KB`,
        "MB"   : (n)=> `${(n/(1024*1024)).toFixed(2)} MB`,
        "GB"   : (n)=> `${(n/(1024*1024*1024)).toFixed(2)} GB`,
    }[mode];
    return unitTransfrom(sizeof(obj));
}

var argvs = process.argv;
console.log(sizeCounter(argvs[2],argvs[3]));
