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


@app.route("/marketdata/price", methods=["GET"])
def get_price():
    args = request.args

    headers_dict = {
        "content-type": "application/json",
        "accept": "application/json",
    }
    url = "https://api.coingecko.com/api/v3/simple/price"
    resp = requests.get(url, params=args, headers=headers_dict)
    data = resp.json()
    return jsonify(data)


if __name__ == "__main__":
    app.run()
