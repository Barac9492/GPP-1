from amazon import crawl_amazon
from coupang import crawl_coupang
from firestore_utils import save_product

def main():
    keywords = ["cosrx", "laneige", "macbook", "iphone"]
    for kw in keywords:
        print(f"Amazon: {kw}")
        for item in crawl_amazon(kw):
            print(item)
            save_product("amazon_products", item)
        print(f"Coupang: {kw}")
        for item in crawl_coupang(kw):
            print(item)
            save_product("coupang_products", item)

if __name__ == "__main__":
    main() 