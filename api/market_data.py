from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

api_key = os.environ.get("CG_API_KEY")

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

    headers_dict = {
        "content-type": "application/json",
        "accept": "application/json",
        "x-cg-pro-api-key": api_key
    }
    url = "https://pro-api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params=args, headers=headers_dict)
    data = resp.json()
    return jsonify(data)


if __name__ == "__main__":
    app.run()
