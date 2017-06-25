const utils = require("./utils");
const expect = require("expect");
// // Ver 1 : 基本寫法
// // 加法測試
// it("should add two numbers" , ()=>{
//    var res = utils.add(23,11);
//    if(res !== 34){
//        throw new Error(`Expected 34 , but got ${res}`);
//    }
// });
//
// // 乘法測試
// it("should square number" , ()=>{
//     var res = utils.square(3);
//     if(res !== 9){
//         throw new Error(`Expected 123 , but got ${res}`);
//     };
// })


//  Ver 2 : Expect 寫法
// it("should add two numbers" , ()=>{
//    var res = utils.add(23,11);
//    expect(res).toBe(34).toBeA("number");
// });
//
// it("should square number" , ()=>{
//     var res = utils.square(3);
//     expect(res).toBe(9).toBeA("number");
// })


// Ver 3 : 物件等價
// toBe : 比較 reference (比變數的 '位置')
// it('should expect some value : toBe', () => {
//   expect({name : "Jeff"}).toBe({name : "Jeff"});
// });
//
// // toEqual : 比較 value (比變數的 '值')
// it('should expect some value : toEqual', () => {
//   expect({country: 'Taiwan'}).toEqual({country: 'Taiwan'});
// });
//
//
// it("should expect some value : test Object" , ()=>{
//     expect({
//         country : "Taiwan" ,
//         city : "Taipei" ,
//         size : 25
//     }).toInclude({
//         size : 25
//     })
// })


// Ver 4 : 異步測試
// it("should async add tow numbers",(done)=>{
//     var res = utils.asyncAdd(33,11,(sum)=>{
//         expect(sum).toBe(44).toBeA("number");
//         done();
//     });
// })


// Ver 5 : 分類 test describe.
describe("Add" , ()=>{
    it("should add 2 number #1 , 57" ,(done)=>{
        var res = utils.asyncAdd(23,34 , (sum)=>{
            expect(sum)
                .toBe(57)
                .toBeA("number");
            done();
        })
    });
    it("should add 2 number #2 , 274" ,(done)=>{
        var res = utils.asyncAdd(230,44 , (sum)=>{
            expect(sum)
                .toBe(274)
                .toBeA("number");
            done();
        })
    });
    it("should add 2 number #3 , 1241" ,(done)=>{
        var res = utils.asyncAdd(911,250 , (sum)=>{
            expect(sum)
                .toBe(1241)
                .toBeA("number");
            done();
        })
    });
});

describe("Square" , ()=>{
    it("should square 1 number #1 , 25" ,(done)=>{
        var res = utils.square(5);
        expect(res).toBe(25).toBeA("number");
    });
    it("should square 1 number #2  , 1024" ,(done)=>{
        var res = utils.square(32);
        expect(res).toBe(1024).toBeA("number");
    });
    it("should square 1 number #3 , 9527" ,(done)=>{
        var res = utils.square(12);
        expect(res).toBe(9527).toBeA("number");
    });
})
