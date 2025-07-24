import requests
from bs4 import BeautifulSoup

ASSOCIATES_ID = "ethancho-20"

def add_affiliate_tag(link):
    if "tag=" not in link:
        if "?" in link:
            return f"{link}&tag={ASSOCIATES_ID}"
        else:
            return f"{link}?tag={ASSOCIATES_ID}"
    return link

def crawl_amazon(keyword, max_results=10):
    url = f"https://www.amazon.com/s?k={keyword}"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    items = []
    for item in soup.select(".s-result-item[data-asin]")[:max_results]:
        title = item.select_one("h2 span")
        price = item.select_one(".a-price .a-offscreen")
        link = item.select_one("h2 a")
        if title and price and link:
            product_link = "https://www.amazon.com" + link["href"]
            product_link = add_affiliate_tag(product_link)
            items.append({
                "title": title.text.strip(),
                "price": price.text.strip(),
                "link": product_link
            })
    return items 