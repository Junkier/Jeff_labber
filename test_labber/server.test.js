const request = require("supertest");
const expect = require("expect");
var app = require("./server").app;

// Ver1 . 基本版
// it("shoud return hello world response" , (done)=>{
//     request(app)
//         .get("/")
//         .expect("Hello World!!!")
//         .end(done);
// })

// Ver2.  TDD 版
// 期望拿 404 {"error":"Page not found."}
describe("GET / " , ()=>{
    it("should return 404 page error" , (done)=>{
        request(app)
            .get("/")
            .expect(404)
            .expect((res)=>{
                // console.log(res);
                expect(res.body).toInclude({
                    "error" : "Page not found."
                })
            })
            .end(done);
    });
})


// Ver3. TDD / BDD 實作版
describe("GET /latlng" , ()=>{
    it("should get latlng." , (done)=>{
        // 中文有 bug
        let address = encodeURIComponent("114台北市內湖區台北市內湖區行愛路141巷18號4樓") ;
        let latlng = {
            "lat" : 25.0647376,
            "lng" : 121.5805774
        };
        request(app)
            .get(`/latlng?address=${address}`)
            .expect(200)
            .expect((res)=>{
                console.log(res.body);
                expect(res.body).toInclude(latlng)
            })
            .end(done);
    });


    it("should get error : lack of address" , (done)=>{
        request(app)
            .get(`/latlng`)
            .expect(400)
            .expect((res)=>{
                expect(res.body).toInclude({"error":"lack of address"})
            })
            .end(done);
    })
});
