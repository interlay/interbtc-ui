import { createInterBtcApi, isForeignAsset } from "@interlay/interbtc-api";
import { getCoingeckoId } from "./currency-utils";

const tvlDex = async (request, response) => {
    if (request.method === 'GET') {
        const interbtcApi = await createInterBtcApi(
            process.env.REACT_APP_PARACHAIN_URL,
            process.env.REACT_APP_BITCOIN_NETWORK,
            undefined,
            3
        );

        const pools = await interbtcApi.amm.getLiquidityPools();
        const amounts = pools.flatMap((pool) => pool.pooledCurrencies)
            .map((monetaryAmount) => ({
                currency: monetaryAmount.currency,
                coingeckoId: getCoingeckoId(monetaryAmount.currency),
                atomicAmount: monetaryAmount.toString(true),
                amount: monetaryAmount.toHuman()
            }));

        return response.status(200)
            .setHeader("content-type", "application/json")
            .setHeader("cache-control", "public, maxage=0, s-maxage=300")
            .json(amounts);
    } else {
        return response.status(400).send('Bad Request');
    }
}

export default async function (request, response) {
    return tvlDex(request, response);
}
  