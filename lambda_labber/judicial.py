
# coding: utf-8

import requests, re, time ,base64 ,json ,sys
from bs4 import BeautifulSoup as bs

#### 自定義 將大陣列切成小陣列
# // : 整數除法
def SplitList(alist, wanted_parts):
    length = len(alist)
    return [ alist[i*length // wanted_parts: (i+1)*length // wanted_parts] 
             for i in range(wanted_parts) ]

def Judicial(query_id):
    
#     base_url = "http://domestic.judicial.gov.tw/abbs/wkw/WHD9HN02.jsp"  --> 0910 換過網址

    base_url = "http://domestic.judicial.gov.tw/abbs/wkw/WHD9HN02.jsp?from=WHD9HN01.jsp" 
    HEADERS_IDENTIFICATION = {
        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding":"gzip, deflate",
        "Accept-Language":"zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4",
        "Cache-Control":"max-age=0",
        "Connection":"keep-alive",
        "Host":"domestic.judicial.gov.tw",
        "Referer":"http://domestic.judicial.gov.tw/abbs/wkw/WHD9HN01.jsp",
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
    }

    ## 查詢資料
    payload = {
        "kd_id":"",
        "idnoyn":"N",
        "crtid":"",
        "idno":"{}".format(query_id),
        "sddtStart":"",
        "sddtEnd":""
    }

    res = requests.post(base_url, headers=HEADERS_IDENTIFICATION, data=payload)
    soup = bs(res.text, 'lxml') 

    col_name =[]
    for tag in soup.select('td.headB div')[:7]:
        col = tag.text.strip()
        col_name.append(col)

    reply = []
    ## 判斷有回應資料
    if len(soup.select('tr > td.trB > div[align="left"]')) > 5 :
        for tag in soup.select('tr > td.trB > div[align="left"]')[1:]:
            reply.append(tag.text.strip())
            
        ## 計算項次數 :
        parts = int(len(reply)/7)
        resp_list = [ dict(zip(col_name,partial)) for partial in SplitList(reply, parts)]

    else:
        for tag in soup.select('form div[align="center"]'):
            if tag.text.strip() != "":
                reply.append(tag.text.strip())
                
    if "查無資料" in reply :
        result = []
        # result = "查無資料"
    else:
        result = resp_list
    return result

print ("def Judicial prepared")

# [INPUT]
# @ USER_ID { string }
# stdin_data=json.loads(sys.stdin.readline())
# USER_ID = stdin_data["id"]


# [TEST]
### 有資料
USER_ID = "S224529260"
### 查無資料
# USER_ID = "F127870379"

t_start = time.time()
result = Judicial(query_id=USER_ID)

# [OUTPUT]
# @ result : {dict} ( key 為各資料欄位) // {string}
print(result)
# print(json.dumps({"result":result,"time":"{:.3f}".format(time.time()-t_start)}))

