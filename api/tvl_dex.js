import { createInterBtcApi } from "@interlay/interbtc-api";

const tvlDex = async (request, response) => {
    if (request.method === 'GET') {
        const interbtcApi = await createInterBtcApi(process.env.REACT_APP_RELAY_CHAIN_URL, process.env.REACT_APP_BITCOIN_NETWORK);

        const pools = await interbtcApi.amm.getLiquidityPools();
        const currencies = pools.flatMap((pool) => pool.pooledCurrencies);

        return response.status(200)
            .setHeader("content-type", "application/json")
            .setHeader("cache-control", "public, maxage=0, s-maxage=300")
            .json(currencies);
    } else {
        return response.status(400).send('Bad Request');
    }
}

export default async function (request, response) {
    return tvlDex(request, response);
}
  