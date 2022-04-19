from flask import Flask
import requests
import os

SUBSCAN_URL = "https://kintsugi.api.subscan.io/"

API_KEY = os.environ.get("SUBSCAN_API_KEY")


def from_10_decimals(val):
    return val / 1_000_000_000_000


def from_8_decimals(val):
    return val / 10_000_000_000


def subscan_get_request(url):
    headers_dict = {"content-type": "application/json", "X-API-KEY": API_KEY}
    return requests.get(url)


def subscan_post_request(url, json):
    headers_dict = {"content-type": "application/json", "X-API-KEY": API_KEY}
    return requests.post(url, json=json)


app = Flask(__name__)


@app.route("/supply/kint-circ-supply", methods=["GET"])
def get_kint_circ_supply():
    token_info_subscan = subscan_get_request(SUBSCAN_URL + "api/scan/token").json()["data"]["detail"]
    unvested_supply = from_10_decimals(int(token_info_subscan["KINT"]["available_balance"]))
    system_accounts_subscan = subscan_post_request(
        SUBSCAN_URL + "api/scan/accounts",
        json={"filter": "system", "row": 25, "page": 0},
    ).json()["data"]["list"]
    system_accounts_supply = sum([float(a["balance"]) for a in system_accounts_subscan])
    circulating_supply = unvested_supply - system_accounts_supply
    return str(circulating_supply)


@app.route("/supply/kint-total-supply", methods=["GET"])
def get_kint_total_supply():
    return str(10_000_000)


@app.route("/supply/kbtc-supply", methods=["GET"])
def get_kbtc_supply():
    token_info_subscan = subscan_get_request(SUBSCAN_URL + "api/scan/token").json()["data"]["detail"]
    kBTC_supply = from_10_decimals(int(token_info_subscan["KBTC"]["available_balance"]))
    return str(kBTC_supply)


if __name__ == "__main__":
    app.run()
