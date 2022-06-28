from flask import Flask
import requests
import os

KINT_SUBSCAN_URL = "https://kintsugi.api.subscan.io/"
INTR_SUBSCAN_URL = "https://kintsugi.api.subscan.io/"

KINT_API_KEY = os.environ.get("SUBSCAN_API_KEY")
INTR_API_KEY = os.environ.get("INTR_SUBSCAN_API_KEY")

CROWDLOAN_VESTING_END = 4838400


def from_12_decimals(val):
    return val / 1_000_000_000_000


def from_10_decimals(val):
    return val / 10_000_000_000


def from_8_decimals(val):
    return val / 100_000_000


def subscan_get_request(url):
    api_key = KINT_API_KEY
    if url.startswith(INTR_SUBSCAN_URL):
        api_key = INTR_API_KEY

    headers_dict = {"content-type": "application/json", "X-API-KEY": api_key}
    return requests.get(url, headers=headers_dict)


def subscan_post_request(url, json):
    api_key = KINT_API_KEY
    if url.startswith(INTR_SUBSCAN_URL):
        api_key = INTR_API_KEY

    headers_dict = {"content-type": "application/json", "X-API-KEY": api_key}
    return requests.post(url, json=json, headers=headers_dict)


def max_crowdloan_vested():
    current_block = int(
        subscan_get_request(INTR_SUBSCAN_URL + "api/scan/metadata").json()["data"][
            "blockNum"
        ]
    )
    return 0.3 + (current_block / CROWDLOAN_VESTING_END)


app = Flask(__name__)


@app.after_request
def add_header(response):
    response.cache_control.max_age = 3600
    return response


@app.route("/supply/kint-circ-supply", methods=["GET"])
def get_kint_circ_supply():
    token_info_subscan = subscan_get_request(
        KINT_SUBSCAN_URL + "api/scan/token"
    ).json()["data"]["detail"]
    unvested_supply = from_12_decimals(
        int(token_info_subscan["KINT"]["available_balance"])
    )
    system_accounts_subscan = subscan_post_request(
        KINT_SUBSCAN_URL + "api/scan/accounts",
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
    token_info_subscan = subscan_get_request(
        KINT_SUBSCAN_URL + "api/scan/token"
    ).json()["data"]["detail"]
    kBTC_supply = from_8_decimals(int(token_info_subscan["KBTC"]["available_balance"]))
    return str(kBTC_supply)


@app.route("/supply/intr-circ-supply", methods=["GET"])
def get_intr_circ_supply():
    token_info_subscan = subscan_get_request(
        INTR_SUBSCAN_URL + "api/scan/token"
    ).json()["data"]["detail"]
    unvested_supply = from_10_decimals(
        int(token_info_subscan["INTR"]["available_balance"])
    )
    system_accounts_subscan = subscan_post_request(
        INTR_SUBSCAN_URL + "api/scan/accounts",
        json={"filter": "system", "row": 25, "page": 0},
    ).json()["data"]["list"]
    system_accounts_supply = sum([float(a["balance"]) for a in system_accounts_subscan])
    circulating_supply = unvested_supply - system_accounts_supply
    return str(circulating_supply)


@app.route("/supply/intr-total-supply", methods=["GET"])
def get_intr_total_supply():
    return str(1_000_000_000)


@app.route("/supply/ibtc-supply", methods=["GET"])
def get_ibtc_supply():
    token_info_subscan = subscan_get_request(
        INTR_SUBSCAN_URL + "api/scan/token"
    ).json()["data"]["detail"]
    kBTC_supply = from_10_decimals(int(token_info_subscan["IBTC"]["available_balance"]))
    return str(kBTC_supply)


if __name__ == "__main__":
    app.run()
