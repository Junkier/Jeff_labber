$(function(){
    console.log(Rx);

    // Rx 處理點擊事件
    // Rx.Observable.fromEvent(window,"click")
    //   .map(e=> e.target)
    //   .subscribe(v=>{
    //       console.log("Click :" , v);
    //   });

    // Rx 顯示點擊次數
    // Rx.Observable.fromEvent(window,"click")
    //     .map(e=>{console.log(e);return 1})
    //     .scan((total,now)=>{console.log(total);return total+now})
    //     .subscribe(w=>{
    //         $("#click-time").text(w);
    //     });

    // +1 / -1 事件
    // jQuery ver.
    // $("#plus").click(()=>{
    //     let total = $("#click-time").text();
    //     total = parseInt(total)+1;
    //     $("#click-time").text(total);
    // });
    // $("#minus").click(()=>{
    //     let total = $("#click-time").text();
    //     total = parseInt(total)-1;
    //     $("#click-time").text(total);
    // });

    // Rx ver.
    // 合併兩個 Observable
    Rx.Observable.fromEvent($("#plus").get()[0],"click")
        .mapTo(1)
        .merge(
            Rx.Observable.fromEvent($("#minus").get()[0],"click").mapTo(-1)
        )
        .scan((total,now)=> total+now)
        .subscribe(w=>{
            $("#click-time").text(w);
            // console.log(w);
        });

    // Canvas 做圖
    var canvas = $("#canvas-qq").get()[0];
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth=1;
    function draw(e){
        ctx.lineTo(e.clientX,e.clientY);
        ctx.stroke();
    };

    // jQuery ver.
    // $("#canvas-qq").on("mousedown",(e)=>{
    //     ctx.moveTo(e.clientX,e.clientY);
    //     $(this).on("mousemove",draw);
    // });
    // $("#canvas-qq").on("mouseup",(e)=>{
    //     $(this).off("mousemove");
    // });

    // RxJs ver.
    // 建立一個 Observable
    Rx.Observable.fromEvent(canvas,"mousedown")
        .do(e=>{
            ctx.moveTo(e.clientX,e.clientY);
        })
        .flatMap(e=>
            Rx.Observable.fromEvent(canvas,"mousemove")
              .takeUntil(Rx.Observable.fromEvent(canvas,"mouseup"))
        )
        .subscribe(v=>{
            // console.log("Value : ",v);
            draw(v);
        });

    // Auto complete
    // jQuery ver.
    // var timer = null;
    // $("#auto-complete").on("input",function(){
    //     let word = $(this).val();
    //     if(timer){
    //         clearTimeout(timer);
    //     };
    //     timer = setTimeout(()=>{
    //         searchWikipedia(word)
    //             .then(data=>{
    //                 console.log(data);
    //                 if(data[0] === word) renderList(data[1]);
    //             })
    //             .catch(err=>{
    //                 $('.auto-complete__list').hide();
    //                 console.log(err);
    //             });
    //     },250);
    // });

    // Rx ver.
    Rx.Observable.fromEvent($("#auto-complete").get()[0],"input")
                 .debounceTime(250)
                 .map(e=>e.target.value)
                 .switchMap(v=>{
                     return v.length>0 ? Rx.Observable.fromPromise(searchWikipedia(v))
                                         .map(result=>result[1])
                                       : Rx.Observable.of([])
                 })
                 .subscribe(v=>{
                     if(v) renderList(v);
                 });

    Rx.Observable.fromEvent($(".auto-complete__list").get()[0],"click")
                 .filter(e=> e.target.matches("li"))
                 .map(e=> $(e.target).text())
                 .subscribe(v=>{
                     $("#auto-complete").val(v);
                     $(".auto-complete__list").hide();
                 });

});

function searchWikipedia (term) {
    return $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: term
        }
    }).promise();
};


function renderList (list) {
  $('.auto-complete__list').empty().show();
  $('.auto-complete__list').append(list.map(item => '<li>' + item + '</li>'))
}


//
// var canvas = document.getElementById('canvas');
// var ctx = canvas.getContext('2d');
// ctx.beginPath(); // 開始畫畫
//
// function draw(e){
//   ctx.lineTo(e.clientX,e.clientY); // 移到滑鼠在的位置
//   ctx.stroke(); // 畫畫
// }
//
// // 按下去滑鼠才開始偵測 mousemove 事件
// canvas.addEventListener('mousedown', function(e){
//   ctx.moveTo(e.clientX, e.clientY); // 每次按下的時候必須要先把繪圖的點移到那邊，否則會受上次畫的位置影響
//   canvas.addEventListener('mousemove', draw);
// })
//
// // 放開滑鼠就停止偵測
// canvas.addEventListener('mouseup', function(e){
//   canvas.removeEventListener('mousemove', draw);
// })
