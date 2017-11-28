function goAjax(_query) {
    return $.ajax({
        url: _query.url,
        data: _query.data,
        type: _query.type || "POST",
        dataType: "json",
        timeout: _query.timeout,
    });
};

function timePicker(option) {

    /**
     * dependencies
     *   <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
     *   <script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
     *   <script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/zh-tw.js"></script>
     *   <script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/js/bootstrap-datetimepicker.min.js"></script>
     *   <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css">
     * Warning :
     *   jQuery 3.X ver. will not work for bootstrap-datetimepicker = =
     */

    /**
     * option params
     * @param {String} place : main locations to build time-picker,
                               'class' preferred because it can support multi-terms building,  ex : ".channel"
     * @param {String} stId  : datetime-picker start time's element id , ex: "#start_timeQQ"
     * @param {String} etId  : datetime-picker end time's element id   , ex: "#end_timeQQ"
     * @param {Number} diffMonth : difference month among start-time & end-time.
     */

    // alpha ver.
    var startTimeId = (option.place + " " + option.stId) || "#start_timeQQ";
    var endTimeId = (option.place + " " + option.etId) || "#end_timeQQ";
    var diffMonth = option.diffMonth || 6;

    // Catch current time.
    $(startTimeId + " input[name='start_time']").val(moment(new Date()).subtract(diffMonth, "months").format("YYYY年M月D日"));
    $(endTimeId + " input[name='end_time']").val(moment(new Date()).subtract(1, "days").format("YYYY年M月D日"));

    $(startTimeId).datetimepicker({
        format: 'LL', // time Format based on what u want.
        minDate : moment(new Date()).subtract(6, "months").format("YYYY-MM-DD"),
        maxDate : moment(new Date()).format("YYYY-MM-DD"),
    });

    $(endTimeId).datetimepicker({
        format: 'LL',
        minDate: new Date(moment(new Date()).subtract(diffMonth, "months").format("YYYY-MM-DD")),
        maxDate: moment(new Date()).format("YYYY-MM-DD"),
        useCurrent: false
    });

    $(startTimeId).on("dp.change", function(e) {
        var $location = $(this).parents(option.place);
        $location.find(option.etId).data("DateTimePicker").minDate(e.date);
    });
    $(endTimeId).on("dp.change", function(e) {
        var $location = $(this).parents(option.place);
        $location.find(option.stId).data("DateTimePicker").maxDate(e.date);
    });
};

function createArticlesTable(option) {
    /**
     * option params
     * @param {String} place : main location to build articles list , ex : "#articles" , "#article tobdy"
     * @param {Array}  order : your display order on the table , ex : ["title","volume","website"] / ["rank","title","time",...]
     * @param {Bool}   containRankTd : displaying rank td in the first place or not. , default is true.
     *  - Attention :
     *    "title" -> include "url" automatically
     *    "time"  -> format is always "YYYY-MM-DD"
     *    "semantic" -> include "content_semantic_tag" & "content_semantic_grade" , and it'll be transferred into img.
     * @param {String} data  : articles data from eyeSocial info API ,
     **/ // ex : [ele,...] , the spec of ele is in the following paragraphs

    // ele = {
    //     time:"2017-07-31 16:47:40"
    //     title:"[閒聊] 國王遊戲 動畫化 "
    //     url:"https://www.ptt.cc/bbs/C_Chat/M.1501490863.A.640.html"
    //     author:"wl760713"
    //     field:"forum"
    //     website:"ptt"
    //     volume:120
    //     content_semantic_grade:0
    //     content_semantic_tag:"neu"
    //     resp_attitude:"neutral"
    // }
    var containRankTd = option.containRankTd === false ? false : true;

    // 會有 div - title - sorted 的 filed - titleHeader
    // 插入 tbody 即可.
    var content = "";
    // Algorithm.
    // ["title","time","author"] ==>  [f1,f2,f3] ==> f1(e) + f2(e) + f3(e)

    var generator = {
        time     : function(ele){
            return "<td class='td-time'>"+(ele.time.split(" ")[0])+"</td>";
        },
        title    : function(ele){
            var titleDetail  = cutWords(ele.title,25);
            return "<td class='td-title'><a href='" + ele.url + "' target='_blank'>"+(titleDetail)+"</a></td>";
        },
        author   : function(ele){
            var rawAuthor = ele.author || ele.name;
            var authorContent = MAPPING_DICT.En_2_Zh_Dict.hasOwnProperty(rawAuthor) ? MAPPING_DICT.En_2_Zh_Dict[rawAuthor] : rawAuthor;
            var authorDetail = cutWords(authorContent,10);
            return "<td class='td-author'>"+(authorDetail)+"</td>";
        } ,
        field    : function(ele){
            return "<td class='td-field'>"+(MAPPING_DICT.En_2_Zh_Dict[ele.field])+"</td>";
        },
        website  : function(ele){
            var websiteDetail = cutWords(MAPPING_DICT.En_2_Zh_Dict[ele.website] , 8);
            return "<td class='td-website'>"+(websiteDetail)+"</td>";
        },
        source : function(ele){  // source = website+category
            //  一般 : 自行併
            //  KOL : 已併好
            var out ;
            if(ele.website){
                var source = ele.category || ele.source;  // 之後 deprecated 掉!!!
                var category = ele.category ? cutWords(ele.website === "ptt" ? MAPPING_DICT.pttCategoryDict[ele.category]:ele.category ,10 ) : "";
                var websiteDetail = cutWords(MAPPING_DICT.En_2_Zh_Dict[ele.website] , 8);
            }else{
                var web = ele.source.split("-QQ-")[0];
                var category = ele.source.split("-QQ-")[1].split(",")
                                    .map(function(c){
                                        return cutWords(web === "ptt" ? MAPPING_DICT.pttCategoryDict[c]:c,10);
                                    })
                                    .join(",");
                var websiteDetail = cutWords(MAPPING_DICT.En_2_Zh_Dict[web] , 8);
            };
            return "<td class='td-source' style='font-size:14px;'>"+(websiteDetail+"-"+category)+"</td>";
        },
        volume   : function(ele){
            var volume = numeral(ele.volume.toFixed(0)).format('0,0');
            return "<td class='td-volume'>"+volume+"</td>";
        },
        semantic : function(ele){
            var semanticDetail = getSemanticImg(ele.content_semantic_tag,ele.content_semantic_grade) ;
            return "<td class='td-semantic'>"+(semanticDetail)+"</td>";
        },
        srs      : function(ele){
            var srsDetail = ele.resp_srs ? (/^\d*$/.test(ele.resp_srs) ? parseInt(ele.resp_srs): 0) : 0;
            return "<td class='td-srs'>"+(srsDetail)+"</td>";
        },
        doc_cnt  : function(ele){
            var doc_cnt = numeral(ele.doc_cnt.toFixed(0)).format('0,0');
            return "<td class='td-doc_cnt'>"+doc_cnt+"</td>";
        },
        resp_cnt  : function(ele){
            var resp_cnt = numeral(ele.resp_cnt.toFixed(0)).format('0,0');
            return "<td class='td-resp_cnt'>"+resp_cnt+"</td>";
        },
        resp_authors_unique_cnt  : function(ele){
            var resp_authors_unique_cnt = numeral(ele.resp_authors_unique_cnt.toFixed(0)).format('0,0');
            return "<td class='td-resp_authors_unique_cnt'>"+resp_authors_unique_cnt+"</td>";
        },
        post_echo  : function(ele){
            var post_echo = numeral(ele.post_echo.toFixed(0)).format('0,0');
            return "<td class='td-post_echo'>"+post_echo+"</td>";
        },
        pn  : function(ele){
            var pn_ratio = numeral(ele.pn_ratio.toFixed(0)).format('0,0');
            return "<td class='td-pn'>"+pn_ratio+"</td>";
        },
        semantic_bar : function(ele){
            // Fake data;
            // var semantic_bar = "QQ";
            var semantic_bar = (ele.post_semantic.pos+1)/(ele.post_semantic.neg+1);
            return "<td class='td-semantic_bar'>"+numeral(semantic_bar).format('0.000')+"</td>";
        },
        IR  : function(ele){
            return "<td class='td-IR'>"+ numeral(ele.IR).format('0.000')+"</td>";
        },
        bad_cnt : function(ele){
            return "<td class='td-bad_cnt'>"+(ele.resp_type_cnt ? ele.resp_type_cnt.neg : 0)+"</td>";
        },
        resp_attitude : function(ele){
            var out = "";
            if(ele.resp_attitude && ele.resp_attitude.length>0){
                out = {
                    "neutral"  : "中立",
                    "opposite" : "對立",
                    "agree"    : "同意",
                    "conflict" : "衝突"
                }[ele.resp_attitude];
            }else{
                // 可再更換!!!
                out = "無";
            };
            return  "<td class='td-resp_attitude'>"+out+"</td>";
        },
        uniqueId : function(ele){
            return "<td class='td-unique-id' style='display:none;'>"+ele._id+"</td>";
        }
    };

    var combinedFunc = option.order.map(function(k) {
        return generator[k]
    });

    option.data.map(function(ele, index) {
        content += (
            "<tr>" +
                (containRankTd ? "<td class='td-rank' id='td-rank"+index+"'>"+(index+1)+"</td>" : "") +
                (combinedFunc.map(function(f){return f(ele)}).reduce(function(a,b){return a+b})) +
            "</tr>"
        );
    });

    $(option.place).html(content);

    function cutWords(ele, len) {
        return ele.length <= len ? ele : ele.substring(0, len) + "...";
    };

    function getSemanticImg(tag, level) {
        level = level || 1;
        // 路徑會再變動!?

        var src = tag === "neu" ? "common/images/neutral-01.svg" : "common/images/" + tag + "/" + (tag + level) + ".svg";
        // var src = tag === "neu" ? "common/images/neutral.svg" : "common/images/" + tag + "/" + (tag + level) + ".svg";
        // var src = tag === "neu" ? "/common/images/neutral.svg" : "/common/images/" + tag + "/" + (tag + level) + ".svg";
        return "<img src='" + src + "'>";
    };

};

function createDomainsBlock(option) {
    // Being Lack of.
    option.data.map(function(domain_ele) {
        $(option.place).append("<div class='col-md-2'><input type='checkbox' name='domainQQ' value='" + domain_ele["key"] + "' checked>" + domain_ele["key"] + " </div>");
    })
};

function createChannelsBlock(option) {
    // Multi-terms ver.

    /**
     * dependencies
     *   <script src="../common/js/bootstrap-multiselect.js"></script> [Freeman ver.]
     *   <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.13/css/bootstrap-multiselect.css">
     */

    /**
     * option params
     * @param {Boolean} downToCategories : decide the display level to websites or categoies , default 'false' means to websites level.
     * @param {String}  place : main locations to build channels,
     *                         'class' preferred because it can support multi-terms building,  ex : ".channel"
     * @param {String}  data  : channels data from eyeSocial info API ,
                             // /v1/info/basic/websites  , /v1/info/basic/categories
     */ // ex : {forum : {...} , blog : {...} , ...}

    var raw_data = option.data;
    var numArray = Array($(option.place).length).fill(0);
    var places = $(option.place);
    downToCategories = option.downToCategories || false;

    // gen website choose block.
    // field - website - category
    Object.keys(raw_data).map(function(fieldName) {
        var content = '';
        var webNumber = 1;
        // Building the options' contents
        // But we should be careful about forum & social_media .
        Object.keys(raw_data[fieldName]["elements"]).map(function(webName) {
            var allWebDocCount = raw_data[fieldName]["elements"][webName]["doc_cnt"],
                cateNumber = 1;

            // Down to categories
            if (isForumOrSocialMedia(fieldName) && downToCategories) {
                content += '<optgroup label="' + MAPPING_DICT.En_2_Zh_Dict[webName] + '" class="group-' + webNumber + '">';
                Object.keys(raw_data[fieldName]["elements"][webName]["elements"]).map(function(cateName) {
                    content += '<option value="' + webNumber + '-' + cateNumber + '" class="' + webName + "-QQ-_r3x89e_" + cateName + '_r3x89e_">' +
                        (webName === "ptt" ? MAPPING_DICT.pttCategoryDict[cateName] : cateName) +
                        ' <span class="countnum"></span></option>';
                    cateNumber++;
                })
                content += '</optgroup>';
            } else {
                content += ('<option value="' + webNumber + '" class = "' + webName + '-QQ-">' + MAPPING_DICT.En_2_Zh_Dict[webName] +
                    ' <span class="countnum"></span></option>');
            };
            webNumber++;
        });

        // 先綁在 setTimeout 上
        // 太誇張再另行辦法!!
        numArray.map(function(num,i){
            var idName = fieldName+'-nonSelectedText'+i;
                // setTimeout(function(){
                    $(places[i]).append(
                        '<div class="btn-group">' +
                            '<select id="'+idName+'" multiple="multiple" style="display: none;" ></select>' +
                        '</div>'
                    );

                    $(places[i]).find("select#"+idName)
                        .html(content)
                        .multiselect({
                            selectAllText: MAPPING_DICT.En_2_Zh_Dict[fieldName] + "全選",
                            enableClickableOptGroups: true,
                            enableCollapsibleOptGroups: true,
                            includeSelectAllOption: true,
                            selectAllJustVisible: false,
                            selectAllValue: fieldName + "_fieldall"+i,
                            buttonText: function(options, select) {
                                return MAPPING_DICT.En_2_Zh_Dict[fieldName] ;
                            }
                    });
                // },0);
        });
    });

    // Initially choose all fields & websites
    // And hide the dropmenu of sub-elements.
    // setTimeout(function(){

    // Display channels list
    // Check whether we should be down to categories or not.
    if (downToCategories) {
        $(option.place + ' select[id*=social_media-nonSelectedText],' +
                option.place + ' select[id*=forum-nonSelectedText]').multiselect('selectAll', false)
            .multiselect('updateButtonText');

        $(option.place + " .multiselect-container li.active:not(:first-child)").addClass("multiselect-collapsible-hidden").css("display", "none");

        $(option.place + ' select[id*=news-nonSelectedText],' +
                option.place + ' select[id*=blog-nonSelectedText]').multiselect('selectAll', false)
            .multiselect('updateButtonText');
    } else {
        $(option.place + ' select[id*=news-nonSelectedText],' + option.place + ' select[id*=blog-nonSelectedText],' +
                option.place + ' select[id*=social_media-nonSelectedText],' + option.place + ' select[id*=forum-nonSelectedText]'
            ).multiselect('selectAll', false)
            .multiselect('updateButtonText');
    };


    // Cancel xuite selected.
    $(option.place + ' select[id*=blog-nonSelectedText]').multiselect('deselect', ['1']);

    $('.selectAll').on('click', function() {
        var $location = $(this).parent();
        var open = $location.attr("class");
        var allElements = "select[id*=social_media-nonSelectedText],select[id*=forum-nonSelectedText],\
                               select[id*=news-nonSelectedText],select[id*=blog-nonSelectedText]";

        if (open.indexOf("isopen") === -1) {
            $location.find(allElements)
                .multiselect('selectAll', false)
                .multiselect('updateButtonText');
            $location.addClass("isopen");
            $(this).text('取消全選');
        } else {
            $location.find(allElements)
                .multiselect('deselectAll', false)
                .multiselect('updateButtonText');
            $location.removeClass("isopen");
            $(this).text('全選');
        };
    });
    // },200);

    function isForumOrSocialMedia(f) {
        return ["forum", "social_media"].indexOf(f) !== -1;
    };
};

function getCareChannels(option) {
    /**
     * option params
     * @param {String} place : main location to get fields/websites list , ex : ".advanced_choose_field"
     * @param {String} type  : choose what you want , "fields" / "websites" only.
     */
    var out = {
        "fields": $(option.place + " input:checked").parents().siblings('select').map(function() {
            return $(this).attr('id').split("-")[0];
        }).get(),
        "websites": $(option.place + " input:checked").map(function() {
            return $(this).parents('li').attr("class").match(/.+(?=-QQ-)/g);
        }).get()
    }[option.type];
    if (option.type === "websites") {
        out = Array.from(new Set(out)).filter(function(w_t) {
            return w_t != "hidden";
        });
    };
    return out;
};

// alpha.ver , 待優化
function getCategoryFilterList(option) {
    /**
     * option params
     * @param {String} place : main location to get domains list , ex : ".advanced_choose_field"
     */

    var place = option.place || "";
    var category_b_list = [],
        category_w_list = [];
    var websiteUncheckedList =
        $(place + " .multiselect-container li.multiselect-group input:not(:checked)") // 有 category 的 li-> input ，找沒被勾到的
        .parentsUntil("li", "a").parent() // 往上定位回 li
        .get() // 轉成 list
        .filter(function(ele) {
            return $(ele).nextUntil("li.multiselect-group").find("input:checked").length > 0;
        });
    websiteUncheckedList
        .map(function(ele) {
            // 找出沒選到的人中， category 裡面是否有被選到
            return $(ele).nextUntil("li.multiselect-group").find("input:not(:checked)");
        })
        .map(function(ele_list) {
            // 找出 category 沒被勾到的人
            ele_list.get().map(function(ele) {
                category_b_list.push(
                    [
                        "",
                        $(ele).parents("li").attr("class").split("-QQ-")[0],
                        $(ele).parents("li").attr("class").split("_r3x89e_")[1],
                        ""
                    ].join("_QQ_")
                )
            });
        });

    websiteUncheckedList
        .map(function(ele) {
            // 找出沒選到的人中， category 裡面是否有被選到
            return $(ele).nextUntil("li.multiselect-group").find("input:checked");
        })
        .map(function(ele_list) {
            // 找出 category 沒被勾到的人
            ele_list.get().map(function(ele) {
                category_w_list.push([
                    "",
                    $(ele).parents("li").attr("class").split("-QQ-")[0],
                    $(ele).parents("li").attr("class").split("_r3x89e_")[1],
                    ""
                ].join("_QQ_"));
            })
        });
    var category_ele = (category_w_list.length <= category_b_list.length ? category_w_list : category_b_list);
    return category_ele.length > 0 ? {
        elements: category_ele,
        list_type: (category_w_list.length <= category_b_list.length ? "white" : "black")
    } : null;
};

function getDomainFilterList(option) {
    /**
     * option params
     * @param {String} place : main location to get domains list , ex : ".advanced_choose_field"
     */

    var domain_w_list = $(option.place + " input[name='domainQQ']:checked"), // White list.
        domain_b_list = $(option.place + " input[name='domainQQ']:not(:checked)"), // Black list.
        domain_ele = (domain_w_list.length <= domain_b_list.length ? domain_w_list : domain_b_list).get().map(function(ele) {
            return $(ele).val()
        });
    return domain_ele.length > 0 ? {
        elements: domain_ele,
        list_type: (domain_w_list.length <= domain_b_list.length ? "white" : "black")
    } : null;
};

function bindingMftButton(option) {
    // 呈現的 style 需要再調整!!!
    /**
     * option params
     * @param {String} buttonPlace : button location where you want to place
     * @param {String} placeMethod : you can choose 'in-append' , 'after' , 'before'
     * @param {String} containerClass  : words container class. It's designed for multi-group like alert / fight-club modules , default: null
     * @param {String} themePlace    : theme place to show off these themes , ex: "#user_themes"
     * @param {String} keywordsPlace : keywords place to show off these themes , ex: "#user_words,#user_advanced_words"
     * @param {String} notwordsPlace : notwords place to show off these themes , ex: "#not_words"
     *   If someone wanna beautify , he/she can use class 'mtf-button' or id 'mtf-button'
     * @param {Bool} forDeveloping : If true , then it can use fake data to develop.
     */
    option.containerClass = option.containerClass || null ;
    option.buildPlace = option.buildPlace || "body";

    // placeMethod
    //  in-append  --> append
    //  before     --> prev
    //  after      --> after
    var button = ' <button class="btn btn-danger mtf-button" type="button" id="mtf-button"><i class="glyphicon glyphicon-heart"></i></button>';
    var addButton = {
        "in-append": function() {
            $(option.buttonPlace).append(button);
        },
        "before": function() {
            $(option.buttonPlace).before(button);
        },
        "after": function() {
            $(option.buttonPlace).after(button);
        },
    }[option.placeMethod];


    addButton();

    $(".mtf-button").click(function() {
        $(this).attr("disabled", "disabled");
        var $table = $("#mft-table");
        if ($table.length > 0) {
            $table.show();
        } else if(option.forDeveloping){
            var data = [
                { index : 1,theme : "陳奕迅",keywords : "陳奕迅",notwords : ""},
                { index : 2,theme : "",keywords : "",notwords : ""},
                { index : 3,theme : "",keywords : "",notwords : ""},
                { index : 4,theme : "",keywords : "",notwords : ""},
                { index : 5,theme : "周杰倫",keywords : "周杰倫|昆凌",notwords : ""},
                { index : 6,theme : "",keywords : "",notwords : ""},
                { index : 7,theme : "",keywords : "",notwords : ""},
                { index : 8,theme : "柯文哲",keywords : "柯文哲&世大運",notwords : "蔡英文"},
                { index : 9,theme : "",keywords : "",notwords : ""},
                { index : 10,theme : "微笑棒球",keywords : "世大運&棒球&中華隊",notwords : "女排,網球,田徑"},
            ];
            genThemesTable(data);
        }else{
            goAjax({
                url: "/members/favor-themes/data",
                type: "GET",
                dataType: "json",
                timeout: 10000,
            }).done(function(r, a, b) {
                genThemesTable(r.result);
            }).fail(function(err) {
                console.log(err);
                $(this).removeAttr("disabled");
            });
        }
    });

    function genThemesTable(d) {
        var content = d.map(function(ele) {
            var nulltip = "---";
            var theme = (!ele.theme || ele.theme.length === 0) ? nulltip : ele.theme;
            var keywords = (!ele.keywords || ele.keywords.length === 0) ? nulltip : ele.keywords;
            var notwords = (!ele.notwords || ele.notwords.length === 0) ? nulltip : ele.notwords;
            return "<tr>" +
                "<td class='zmft-index'>"+ ele.index + "</td>" +
                "<td class='mft-theme'>" + theme + "</td>" +
                "<td class='mft-keywords'>" + keywords + "</td>" +
                "<td class='mft-notwords'>" + notwords + "</td>" +
                "</tr>";
        }).reduce(function(a, b) {
            return a + b
        });

        var tableTemplate =
            '<div id="mft-table" data-scroll-scope="force">\
                <span class="mft-close">\
                    <img src="../common/images/close.svg"></span>\
                <table class="table table-striped highlight mft-thead">\
                    <thead>\
                      <tr>\
                         <th class="mft-index"><i class="glyphicon glyphicon-heart"></i></th>\
                         <th class="mft-theme">最愛主題</th>\
                         <th class="mft-keywords">搜尋詞組</th>\
                         <th class="mft-notwords">排除關鍵字</th>\
                      </tr>\
                    </thead>\
                </table>\
                <table class="table table-striped mft-tbody">\
                   <tbody>' + content + '</tbody>\
                </table>\
             </div>';

        $(option.buildPlace).append(tableTemplate);
        // $("#gen_advanced_search_page").append(tableTemplate);

        // Close
        $(".mft-close").click(releaseButtonLock);

        // When specific tr click , we'll bring keywords & notwords into user's place automatically.
        $("table.mft-tbody tr").click(function() {
            var $td = $(this).find("td").get().map(function(ele) {
                return $(ele).text()
            }).slice(1, 4);
            var nulltip = "---";
            var theme = $td[0] !== nulltip ? $td[0] : "";
            var keywords = $td[1] !== nulltip ? $td[1] : "";
            var notwords = $td[2] !== nulltip ? $td[2] : "";
            // 找顯示中的!!!
            // 目前可用 .active 來判斷 , 之後看有無要新增的
            var mainPlace = option.containerClass ? (option.containerClass + ".active") : "body";
            var $location = $(mainPlace);
            $location.find(option.themePlace).val(theme);
            $location.find(option.keywordsPlace).val(keywords);
            $location.find(option.notwordsPlace).val(notwords);
            releaseButtonLock();
        });
    };

    function releaseButtonLock() {
        $("#mft-table").hide();
        $(".mtf-button").removeAttr("disabled");
    };

};
