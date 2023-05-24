import requests
import dateutil.parser
from datetime import datetime
from dateutil.tz import tzutc
from flask import Flask, jsonify, abort


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
        return status["chainHeightDiff"] < 3 and status["secondsDiff"] < 7200  # 2hrs


class Vault:
    def __init__(self, baseUrl) -> None:
        self.baseUrl = baseUrl

    def _latestVaults(self):
        q = """
            query MyQuery {
                vaults(limit: 10, orderBy: registrationBlock_active_DESC) {
                    id
                    registrationTimestamp
                }
            }
        """
        payload = {"query": q, "variables": None}
        resp = requests.post(self.baseUrl, json=payload)
        return resp.json()["data"]["vaults"]

    def isHealthy(self):
        vaults = self._latestVaults()
        return len(self._latestVaults()) > 0


KSM_URL = "https://api-kusama.interlay.io/graphql/graphql"
INTR_URL = "https://api.interlay.io/graphql/graphql"
TESTNET_INTR = "https://api-testnet.interlay.io/graphql/graphql"
TESTNET_KINT = "https://api-dev-kintsugi.interlay.io/graphql/graphql"

app = Flask(__name__)


@app.route("/_health/<chain>/oracle", methods=["GET"])
def get_oracle_health(chain):
    def oracle():
        if chain == "kint":
            return Oracle(KSM_URL, "KSM")
        elif chain == "intr":
            return Oracle(INTR_URL, "DOT")
        elif chain == "testnet_kint":
            return Oracle(TESTNET_KINT, "KSM")
        elif chain == "testnet_intr":
            return Oracle(TESTNET_INTR, "DOT")
        else:
            abort(404)

    return jsonify(oracle().isHealthy())


@app.route("/_health/<chain>/relay", methods=["GET"])
def get_relay_health(chain):
    def relay():
        if chain == "kint":
            return Relayer(KSM_URL)
        elif chain == "intr":
            return Relayer(INTR_URL)
        elif chain == "testnet_kint":
            return Relayer(TESTNET_KINT)
        elif chain == "testnet_intr":
            return Relayer(TESTNET_INTR)
        else:
            abort(404)

    return jsonify(relay().isHealthy())


@app.route("/_health/<chain>/vault", methods=["GET"])
def get_vault_health(chain):
    def vault():
        if chain == "kint":
            return Vault(KSM_URL)
        elif chain == "intr":
            return Vault(INTR_URL)
        elif chain == "testnet_kint":
            return Vault(TESTNET_KINT)
        elif chain == "testnet_intr":
            return Vault(TESTNET_INTR)
        else:
            abort(404)

    return jsonify(vault().isHealthy())


if __name__ == "__main__":
    o = Relayer(INTR_URL)
    print(o.isHealthy())
