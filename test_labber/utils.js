// module.exports.add = (a,b)=> a+b ;
// module.exports.square = (x)=> x*x;

exports.add = (a,b)=> a+b ;
exports.square = (x)=> x*x;

exports.asyncAdd = (a,b , callback)=>{
    setTimeout(()=>{
        callback(a+b);
    },500);
};
