const KINT_SUBSCAN_URL = 'https://kintsugi.api.subscan.io/'
const INTR_SUBSCAN_URL = 'https://interlay.api.subscan.io/'

const KINT_API_KEY = process.env.SUBSCAN_API_KEY
const INTR_API_KEY = process.env.INTR_SUBSCAN_API_KEY

function fromDecimals (val, decimals) {
  return val / Math.pow(10, decimals)
}

async function subscanRequest (url, method = 'GET', json = null) {
  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': url.startsWith(INTR_SUBSCAN_URL) ? INTR_API_KEY : KINT_API_KEY
  }

  const options = { method, headers }
  if (json) {
    options.body = JSON.stringify(json)
  }

  const response = await fetch(url, options)
  return await response.json()
}

export default async function (request, response) {
  if (request.method !== 'GET') {
    return response.status(400).send('Bad Request')
  }
  const path = request.url.split('?')[0]
  switch (path) {
    case '/supply/intr-total-supply': {
      const INTR_SUPPLY = 1_000_000_000
      return response
        .status(200)
        .send(INTR_SUPPLY.toString())
    }
    case '/supply/kint-total-supply': {
      const KINT_SUPPLY = 10_000_000
      return response
        .status(200)
        .send(KINT_SUPPLY.toString())
    }
    case '/supply/intr-circ-supply': {
      const unvestedSupply = fromDecimals(parseInt((await subscanRequest(INTR_SUBSCAN_URL + 'api/scan/token')).data.detail.INTR.available_balance), 10)
      const systemAccountsSupply = (await subscanRequest(INTR_SUBSCAN_URL + 'api/scan/accounts', 'POST',
        { filter: 'system', row: 25, page: 0 })).data.list
        .reduce((acc, curr) => acc + parseFloat(curr.balance), 0)
      const circulatingSupply = unvestedSupply - systemAccountsSupply

      return response
        .status(200)
        .send(circulatingSupply.toString())
    }
    case '/supply/kint-circ-supply': {
      const kintUnvestedSupply = fromDecimals(parseInt((await subscanRequest(KINT_SUBSCAN_URL + 'api/scan/token')).data.detail.KINT.available_balance), 12)
      const kintSystemAccountsSupply = (await subscanRequest(KINT_SUBSCAN_URL + 'api/scan/accounts', 'POST',
        { filter: 'system', row: 25, page: 0 })).data.list
        .reduce((acc, curr) => acc + parseFloat(curr.balance), 0)
      const kintCirculatingSupply = kintUnvestedSupply - kintSystemAccountsSupply

      return response
        .status(200)
        .send(kintCirculatingSupply.toString())
    }
    case '/supply/ibtc-supply': {
      const ibtcSupply = fromDecimals(parseInt((await subscanRequest(INTR_SUBSCAN_URL + 'api/scan/token')).data.detail.IBTC.available_balance), 10)
      return response
        .status(200)
        .send(ibtcSupply.toString())
    }
    case '/supply/kbtc-supply': {
      const kbtcSupply = fromDecimals(parseInt((await subscanRequest(KINT_SUBSCAN_URL + 'api/scan/token')).data.detail.KBTC.available_balance), 8)
      return response
        .status(200)
        .send(kbtcSupply.toString())
    }
    default:
      response.status(404).send('Not Found')
  }
};
