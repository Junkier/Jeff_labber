var QQ = [1,2,3,4,5,6];
console.log(QQ.map(n=>n**2));

var SS = new Promise((resolve,reject)=>{
    let name = "Jeff";
    let w1 = `HiHi , I'm ${name}`;
    (()=>{
        console.log(w1);
    })();
})