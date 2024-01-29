// Dia to Coingecko names
const tickers = {
  "Tether USD": "tether",
  "Acala USD": "acala-dollar",
  "BNB": "binancecoin",
  "Wrapped BTC": "wrapped-bitcoin",
  "Dai Stablecoin": "dai",
  "Ether": "ethereum",
  "USD Coin": "usd-coin",
  "tBTC v2": "tbtc",
  "Voucher Dot": "voucher-dot",
  "Voucher KSM": "voucher-ksm",
  "Moonriver": "moonriver"
}

// Coingecko to Dia asset ids
const dia_assets = {
  "bitcoin": "/Bitcoin/0x0000000000000000000000000000000000000000",
  "ethereum": "/Ethereum/0x0000000000000000000000000000000000000000",
  "interlay": "/Interlay/0x0000000000000000000000000000000000000000",
  "polkadot": "/Polkadot/0x0000000000000000000000000000000000000000",
  "kusama": "/Kusama/0x0000000000000000000000000000000000000000",
  "kintsugi": "/Kintsugi/Token:KINT",
  "acala-dollar": "/Acala/Token:AUSD",
  "karura": "/Bifrost/518",
  "tether": "/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "voucher-dot": "/Bifrost-polkadot/2304",
  "voucher-ksm": "/Bifrost/260",
  "binancecoin": "/Ethereum/0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  "bnb": "/Ethereum/0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  "tbtc": "/Ethereum/0x18084fbA666a33d37592fA2633fD49a74DD93a88",
  "dai": "/Ethereum/0x6B175474E89094C44Da98b954EedeAC495271d0F",
  "moonbeam": "/Moonbeam/0x0000000000000000000000000000000000000000",
  "moonriver": "/Moonriver/0x0000000000000000000000000000000000000000/",
  "usd-coin": "/Ethereum/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "wrapped-bitcoin": "/Ethereum/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
}

// Coingecko to Dia XLSD tickers
const dia_xlsd = {
  "voucher-ksm": "vKSM",
  "voucher-dot": "vDOT",
}

// retrieve Dia XLSD fair prices
const fetchDiaXLSD = async () => {
  const url = 'https://api.diadata.org/xlsd'
  const resp = await fetch(url, { headers: { "accept": "application/json" } })
  if (!resp.ok) {
    throw new Error(resp.status)
  }
  const json = await resp.json()
  return new Map(json.map(x => [x.Token, x]))
}

const fetchDiaAsset = async (asset) => {
  try {
    if (!dia_assets[asset]) {
      console.log('Missing DIA asset: ', asset)
      return coingecko({ ids: [asset], vs_currencies: ["usd"] })
    }
    if (asset in dia_xlsd) {
      const prices = await fetchDiaXLSD();
      return {
        [asset]: {
          'usd': prices.get(dia_xlsd[asset]).FairPrice
        }
      }
    }

    const url = 'https://api.diadata.org/v1/assetQuotation' + dia_assets[asset]
    const response = await fetch(url, { headers: { "accept": "application/json" } })
    if (!response.ok) {
      throw new Error(response.status)
    }
    const json = await response.json()

    // optionally rename the ticker
    const name = (tickers[json.Name] ?? json.Name).toLowerCase()
    return {
      [name]: {
        'usd': json.Price
      }
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}

const dia = async (args) => {
  const assets = args.ids.split(',')

  return Promise
    .all(assets.map(x => fetchDiaAsset(x)))
    .then(x => x.reduce((map, obj) => {
      // we need to convert the list to an object
      const k = Object.keys(obj)[0]
      map[k] = obj[k]
      return map
    }, {}))
}

const coingecko = async (args) => {
  const url = 'https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams(args)
  const response = await fetch(url, { headers: { "accept": "application/json" } })
  return await response.json()
}

const fetchPrices = (priceSource, args) => {
  if (priceSource === 'coingecko') {
    return coingecko(args)
  } else if (priceSource === 'dia') {
    return dia(args)
  } else {
    try {
      return dia(args)
    } catch (error) {
      console.log(error)
      return coingecko(args)
    }
  }
}

export default async function (request, response) {
  const args = request.query
  const priceSource = args['price-source']

  const resp = await fetchPrices(priceSource, args)
  return response
    .status(200)
    .setHeader("content-type", "application/json")
    .setHeader("cache-control", "public, maxage=0, s-maxage=300")
    .json(resp)
}
