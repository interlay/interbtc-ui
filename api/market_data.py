from flask import Flask, request
import requests
import os

app = Flask(__name__)


@app.after_request
def add_header(response):
    response.cache_control.max_age = 0
    response.cache_control.s_maxage = 300
    return response


@app.route("/marketdata/price", methods=["GET"])
def get_price():
    args = request.args

    headers_dict = {"content-type": "application/json"}
    url = "https://api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params=args, headers=headers_dict).json()
    return str(resp)


if __name__ == "__main__":
    app.run()
