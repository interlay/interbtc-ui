import { kv } from "@vercel/kv";

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
  "Voucher KSM": "voucher-ksm"
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
  const cache_key = "diaxlsd"
  const cached = await kv.get(cache_key)
  if (cached) {
    return cached
  }

  const url = 'https://api.diadata.org/xlsd'
  const resp = await fetch(url, { headers: { "accept": "application/json" } })
  if (!resp.ok) {
    throw new Error(resp.status)
  }
  const json = await resp.json()
  const result = new Map(json.map(x => [x.Token, x]))

  // cache the data for 120 seconds
  await kv.set(cache_key, result, { ex: 120 })
    .catch(err => console.error('Unable to cache Dia data', err))
  return result;
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
    console.warn('Dia API error for asset: ', asset, error)
    throw error;
  }
}

const dia = async (args) => {
  const cache_key = "dia_" + args.ids
  const cached = await kv.get(cache_key)
  if (cached) {
    return cached
  }

  const assets = args.ids.split(',')
  return Promise
    .all(assets.map(x => fetchDiaAsset(x)))
    .then(x => x.reduce((map, obj) => {
      // we need to convert the list to an object
      const k = Object.keys(obj)[0]
      map[k] = obj[k]
      return map
    }, {}))
    .then(async x => {
      // cache the data for 120 seconds
      kv.set(cache_key, x, { ex: 120 })
        .catch(err => console.error('Unable to cache Dia data', err))
      return x
    })
}

const coingecko = async (args) => {
  const cache_key = "coingecko_" + args.ids
  const cached = await kv.get(cache_key)
  if (cached) {
    console.log('Cached', cache_key, cached)
    return cached
  }

  const url = 'https://api.coingecko.com/api/v3/simple/price?' + new URLSearchParams(args)
  const response = await fetch(url, { headers: { "accept": "application/json" } })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data)
  }

  // cache the data for 120 seconds
  console.log('Caching', cache_key, data)
  kv.set(cache_key, data, { ex: 120 })
    .catch(err => console.error('Unable to cache coingecko data', err))
  return data;
}

const fetchPrices = (priceSource, args) => {
  if (priceSource === 'coingecko') {
    return coingecko(args)
  } else if (priceSource === 'dia') {
    return dia(args)
  } else {
    return dia(args).catch(() => coingecko(args))
  }
}

export default async function (request, response) {
  const args = request.query
  const priceSource = args['price-source']

  try {
    const resp = await fetchPrices(priceSource, args)
    return response
      .status(200)
      .setHeader("content-type", "application/json")
      .setHeader("cache-control", "public, maxage=0, s-maxage=120, stale-while-revalidate=300, stale-if-error=300")
      .json(resp)
  } catch (err) {
    console.error('Unable to fetch prices', err)
    return response.status(500);
  }
}
