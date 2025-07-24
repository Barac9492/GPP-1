import requests
from bs4 import BeautifulSoup

def crawl_coupang(keyword, max_results=10):
    url = f"https://www.coupang.com/np/search?q={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    items = []
    for item in soup.select("ul.search-product-list li.search-product")[:max_results]:
        title = item.select_one(".name")
        price = item.select_one(".price-value")
        link = item.select_one("a.search-product-link")
        if title and price and link:
            items.append({
                "title": title.text.strip(),
                "price": price.text.strip(),
                "link": "https://www.coupang.com" + link["href"]
            })
    return items 