from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("CG_API_KEY")


@app.after_request
def add_header(response):
    response.cache_control.max_age = 0
    response.cache_control.s_maxage = 300
    return response

def coingecko(args):
    headers_dict = {
        "content-type": "application/json",
        "accept": "application/json",
        "x-cg-pro-api-key": api_key,
    }
    url = "https://api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params=args, headers=headers_dict)
    data = resp.json()
    return data

def dia(asset):
    headers_dict = {
        "content-type": "application/json",
        "accept": "application/json",
        "x-cg-pro-api-key": api_key,
    }
    url = "https://api.diadata.org/v1/assetQuotation"
    if asset == "bitcoin":
      url += "/Bitcoin/0x0000000000000000000000000000000000000000"
    elif asset == "interlay":
      url += "/Interlay/0x0000000000000000000000000000000000000000"
    elif asset == "liquid-staking-dot":
      return { "liquid-staking-dot": None }
    elif asset == "polkadot":
      url += "/Polkadot/0x0000000000000000000000000000000000000000/"
    elif asset == "tether":
      url += "/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7"

    resp = requests.get(url, headers=headers_dict)
    data = resp.json()

    return {
      data["Name"].lower(): {
        "usd": data["Price"],
      }
    }


@app.route("/marketdata/price", methods=["GET"])
def get_price():
    args = request.args

    price_source = request.headers.get('x-price-source')

    data = {}

    def _dia():
      ticker_ids = args["ids"].split(",")
      for ticker_id in ticker_ids:
        data.update(dia(ticker_id))

    if price_source == "dia":
       _dia()
    elif price_source == "coingecko":
       data = coingecko(args)
    else:
      try:
        _dia()
      except Exception as e:
        print("Error", e)
        data = coingecko(args)

    return jsonify(data)


if __name__ == "__main__":
    app.run()
