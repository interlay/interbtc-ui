from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

api_key = os.environ.get("CG_API_KEY")

tickers = {
  "Tether USD": "tether",
}

# map coingecko ids to dia ids
dia_assets = {
    "bitcoin": "/Bitcoin/0x0000000000000000000000000000000000000000",
    "interlay": "/Interlay/0x0000000000000000000000000000000000000000",
    "polkadot": "/Polkadot/0x0000000000000000000000000000000000000000",
    "kusama": "/Kusama/0x0000000000000000000000000000000000000000",
    "kintsugi": "/Kintsugi/Token:KINT",
    "acala-dollar": "/Acala/Token:AUSD",
    "tether": "/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7"
}

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
    url = "https://pro-api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params=args, headers=headers_dict)
    data = resp.json()
    return data

def dia(asset):
    headers_dict = {
        "content-type": "application/json",
        "accept": "application/json"
    }

    url = "https://api.diadata.org/v1/assetQuotation"
    try:
      url += dia_assets[asset]
      resp = requests.get(url, headers=headers_dict)
      data = resp.json()

      # optionally rename the ticker
      ticker = tickers.get(data["Name"], data["Name"]).lower()

      return {
        ticker: {
          "usd": data["Price"],
        }
      }
    except KeyError:
      return { asset: None }


@app.route("/marketdata/price", methods=["GET"])
def get_price():
    args = request.args

    price_source = args.get('price-source')

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
