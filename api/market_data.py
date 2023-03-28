from flask import Flask, request
import requests
import os

app = Flask(__name__)


@app.after_request
def add_header(response):
    response.cache_control.max_age = 0
    response.cache_control.s_maxage = 300
    return response


def get_price_coinpaprika():
    args = request.args

    url = "https://api.coinpaprika.com/v1/tickers/"
    tickers = {
        "btc-bitcoin": "bitcoin",
        "kint-kintsugi": "kintsugi",
        "usdt-tether": "tether",
        "ksm-kusama": "kusama",
    }

    output = {}
    for ticker in tickers:
        headers_dict = {"content-type": "application/json"}
        resp = requests.get(url + ticker, headers=headers_dict)
        resp.raise_for_status()
        data = resp.json()
        price = data["quotes"]["USD"]["price"]
        output[tickers[ticker]] = price

    print(output)
    return str(output)


@app.route("/marketdata/price", methods=["GET"])
def get_price():
    args = request.args

    try:
        headers_dict = {"content-type": "application/json"}
        url = "https://api.coingecko.com/api/v3/simple/price"
        resp = requests.get(url, params=args, headers=headers_dict)
        print(args)
        print(resp)
        resp.raise_for_status()
        data = resp.json()
        return str(data)
    except Exception as e:
        return get_price_coinpaprika()


if __name__ == "__main__":
    app.run()
