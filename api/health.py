import requests
import dateutil.parser
from datetime import datetime
from dateutil.tz import tzutc
from flask import Flask, jsonify


class Oracle:
    def __init__(self, baseUrl, token) -> None:
        self.baseUrl = baseUrl
        self.token = token

    def _composableExchangeRateSubquery(self):
        return """{ oracleUpdates: oracleUpdates(
            where: {type_eq: ExchangeRate, typeKey: { token_eq: %s }},
                orderBy: timestamp_DESC,
                limit: 1
            ) {
                oracleId
                timestamp
                updateValue
                height {
                    absolute
                    active
                }
            }
        }
        """ % (
            self.token
        )

    def latestUpdateSeconds(self):
        payload = {"query": self._composableExchangeRateSubquery(), "variables": None}
        resp = requests.post(self.baseUrl, json=payload).json()
        oracles = resp["data"]["oracleUpdates"]

        f = lambda x: (
            datetime.now(tz=tzutc()) - dateutil.parser.isoparse(x["timestamp"])
        ).total_seconds()

        return list(map(f, oracles))

    def isHealthy(self):
        return self.latestUpdateSeconds()[0] < 1800


class Relayer:
    def __init__(self, baseUrl) -> None:
        self.baseUrl = baseUrl

    def _lastRelayedBlock(self):
        q = """
            query MyQuery {
                relayedBlocks(limit: 1, orderBy: id_DESC) {
                    id
                    timestamp
                }
            }
        """
        payload = {"query": q, "variables": None}
        resp = requests.post(self.baseUrl, json=payload)
        return resp.json()["data"]["relayedBlocks"][0]

    def _lastChainBlock(self):
        resp = requests.get("https://btc-mainnet.interlay.io/blocks/tip/height")
        return resp.json()

    def latestUpdate(self):
        chainHeight = self._lastChainBlock()
        paraHeight = self._lastRelayedBlock()

        chainDiff = chainHeight - int(paraHeight["id"])
        secDiff = (
            datetime.now(tz=tzutc()) - dateutil.parser.isoparse(paraHeight["timestamp"])
        ).total_seconds()
        return {"chainHeightDiff": chainDiff, "secondsDiff": secDiff}

    def isHealthy(self):
        status = self.latestUpdate()
        return status["chainHeightDiff"] < 3 and status["secondsDiff"] < 3600


KSM_URL = "https://api-kusama.interlay.io/graphql/graphql"
INTR_URL = "https://api.interlay.io/graphql/graphql"

app = Flask(__name__)


@app.route("/_health/ksm/oracle", methods=["GET"])
def get_ksm_oracle_health():
    return jsonify(Oracle(KSM_URL, "KSM").isHealthy())


@app.route("/_health/ksm/relay", methods=["GET"])
def get_ksm_relayer_health():
    return jsonify(Relayer(KSM_URL).isHealthy())


@app.route("/_health/intr/oracle", methods=["GET"])
def get_intr_oracle_health():
    return jsonify(Oracle(INTR_URL, "DOT").isHealthy())


@app.route("/_health/intr/relay", methods=["GET"])
def get_intr_relayer_health():
    return jsonify(Relayer(INTR_URL).isHealthy())


if __name__ == "__main__":
    o = Relayer(INTR_URL)
    print(o.isHealthy())
