from bs4 import BeautifulSoup as Soup
import json

def get_entries():
    import requests

    url = "https://www.topuniversities.com/sites/default/files/qs-rankings-data/en/3816281_indicators.txt?rr7ebw"

    headers = {
        "user-agent": "Mozilla/5.0",
        "x-requested-with": "XMLHttpRequest"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    records = response.json()["data"]
    result = []
    for r in records: #city, location, overall_rank, uni
        city = r["city"]
        loc = r["location"]
        rank = r["overall_rank"]
        name = Soup(r["uni"],"html.parser").select_one(".uni-link").get_text(strip=True) # "<div class=\"td-wrap\"><div class=\"td-wrap-in\"><a href=\"/universities/massachusetts-institute-technology-mit\" class=\"uni-link\">Massachusetts Institute of Technology (MIT) </a></div></div>"
        result.append({'city':city, 'location':loc, 'ranking':rank, 'name':name})
    with open('records.json', 'w') as f:
        json.dump(result, f)
        

    
def main():

    from itertools import islice

    # 修改这行来打印/保存爬虫结果
    
    get_entries()
    # for entry in islice(get_entries(), 5):
    #     print(entry)
    
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
