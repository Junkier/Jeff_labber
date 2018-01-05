# coding: utf-8
# FPtree by utf-8

#### Load function
#######################################################################################################

from tree_builder import Tree_builder
import tree_building , time , sys , json
from tree_miner import Tree_miner
from collections import Counter

def fptree(routines, min_sup, headerTable, freq_items):

    treeBuilder = Tree_builder(routines=routines, min_sup=min_sup, headerTable=headerTable)
    treeMiner = Tree_miner(Tree=treeBuilder.tree, min_sup=min_sup, headerTable=headerTable, freq_items = freq_items)
    freqitems_set = treeMiner.tree_mine
    return freqitems_set


def fp_association(freqitems_set, keyword, rank, confcut) :
    # keyword is a list.
    support_keyword = 0
    all_freq = 0
    items = []
    for ele in freqitems_set :
        all_freq += float(ele[-1])

        if all( word in ele for word in keyword) :
            support_keyword += float(ele[-1])
            items += [ word for word in ele[0:-1] if word not in keyword ]
            items = list(set(items))
    conf = {}
    for item in items :
        support_union = 0
        support_other = 0
        confidence = 0
        lift = 0
        for ele in freqitems_set :
            if item in ele :
                support_other += float(ele[-1])
                if all( word in ele for word in keyword) :
                    support_union += float(ele[-1])
        confidence = support_union/support_keyword    # p(B|A)
        lift = (support_union/support_keyword)/(support_other)*all_freq    # p(B|A)/p(B) > 1 表示正相關
        if lift > 1 and confidence > confcut :
                conf[item] = confidence

    top = dict(Counter(conf).most_common(rank))

    return top


#######################################################################################################

#### Train model
#######################################################################################################
stdin_data=json.loads(sys.stdin.readline())
# json.load  -> sys.stdin 近來即可，json 會幫你 read
# json.loads -> sys.stdin.readline() 才可，要先自己 read 好
# { "fp_raw_data": fptree_raw_d, "keyword": keyword_list , "query_mode": query_mode}

unicode_decoder = lambda ele :  map(unicode_decoder,ele) if type(ele) is list else ele.strip().encode("utf-8")

# Unicode convert to utf-8
user_contents = map(lambda ele : ele.encode("utf-8") , stdin_data["fp_raw_data"])
corpus = map(lambda ele : ele.strip().split("|") , user_contents)
user_key_word = map(unicode_decoder,stdin_data["keyword"])
query_mode = stdin_data["query_mode"]

min_sup = 2
headerTable = {}
freq_items = []
tree_model = fptree(corpus, min_sup, headerTable, freq_items)

#######################################################################################################

# and : [A,B,C] 直接送入fp_association
# or  : [[A],[B],[C]] 用 for-loop ，變成 [A],[B],[C] 送入fp_association，各取前n個

#### Get words
#######################################################################################################

rank = 10
confcut = 0.02
result = []
judge_list = []
for word_set in user_key_word:
    if type(word_set) is list:
        map(lambda ele : judge_list.append(ele),word_set)
    else:
        judge_list.append(word_set)

try :
    if query_mode == "and":   # And & Normal mode.
        word = "&".join(user_key_word)
        # word = ['台星',"網路"] , 直接一次送進去!!
        # user_key_word. 為一個 list
        the_1st_ele = fp_association(tree_model, user_key_word , rank, confcut)

        the_1st_words = sorted(the_1st_ele.items() , key = lambda ele : ele[1] , reverse = True)
        the_1st_word_list = map(lambda ele : ele[0] ,  the_1st_words)

        for the_1st_ele in the_1st_words:
            if the_1st_ele[0] not in judge_list :
                result.append({
                    "word" : word ,
                    "weight" : the_1st_ele[1],
                    "Level1" : the_1st_ele[0],
                    "Level2" : ""
                })
                judge_list.append(the_1st_ele[0])

                sorted_2nd_result = sorted(fp_association(tree_model , [the_1st_ele[0]] , 10 ,0 ).items() , key = lambda ele : ele[1] , reverse = True)

                for the_2nd_ele in sorted_2nd_result:

                    # the_2nd_ele is a tuple.
                    if the_2nd_ele[0] not in the_1st_word_list  and  the_2nd_ele[0] not in judge_list :
                        result.append({
                            "word" : word ,
                            "weight" : the_2nd_ele[1] ,
                            "Level1" : the_1st_ele[0] ,
                            "Level2" : the_2nd_ele[0]
                        })
                        judge_list.append(the_2nd_ele[0])


    ###########################################################################################################
    elif query_mode == "or": # Or  mode.
        main_word = user_key_word[0][0]
        for word_set in user_key_word:
            count = 1

            # word_set = ["A"] or [["B","C"],["E"]]
            # [] 在外面做好，這裡就不做了QQ
            the_1st_ele = fp_association(tree_model, word_set , rank, confcut)
            the_1st_words = sorted(the_1st_ele.items() , key = lambda ele : ele[1] , reverse = True)
            the_1st_word_list = map(lambda ele : ele[0] ,  the_1st_words)

            for the_1st_ele in the_1st_words:
                max_count = [0,5,4,3,2,2][len(user_key_word)-1] if len(user_key_word) <=6 else 1

                if count >= max_count:
                    continue

                if the_1st_ele[0] not in judge_list :
                    result.append({
                        "word"   : main_word,    # 感覺會出事QQ
                        "weight" : the_1st_ele[1],
                        "Level1" : the_1st_ele[0],
                        "Level2" : ""
                    })
                    judge_list.append(the_1st_ele[0])

                    count += 1

                    sorted_2nd_result = sorted(fp_association(tree_model , [the_1st_ele[0]] , 10 ,0 ).items() , key = lambda ele : ele[1] , reverse = True)

                    for the_2nd_ele in sorted_2nd_result:

                        # the_2nd_ele is a tuple.
                        if the_2nd_ele[0] not in the_1st_word_list  and the_2nd_ele[0] not in judge_list :
                            result.append({
                                "word"   : main_word,
                                "weight" : the_2nd_ele[1] ,
                                "Level1" : the_1st_ele[0] ,
                                "Level2" : the_2nd_ele[0]
                            })
                            judge_list.append(the_2nd_ele[0])

except TypeError as e:
    print json.dumps({"FPtreeErr" : "None Association!!"})


if len(result) > 0:
	print json.dumps({"FPtree" : result})
else :
	print json.dumps({"FPtreeErr" : []})
