import { createInterBtcApi } from "@interlay/interbtc-api";
import { getCoingeckoId, getCoingeckoQueryUrl, getUsdMonetaryAmount } from "./currency-utils";

const tvlLoans = async (request, response) => {
    if (request.method === 'GET') {
        const interbtcApi = await createInterBtcApi(
            process.env.REACT_APP_PARACHAIN_URL,
            process.env.REACT_APP_BITCOIN_NETWORK,
            undefined,
            3
        );

        const loanAssets = await interbtcApi.loans.getLoanAssets();
        const liquidityAmounts = Object.values(loanAssets).map((loanAsset) => loanAsset.totalLiquidity);
        
        // dedupe ids
        const coingeckoIds = new Set(
            liquidityAmounts.map((monetaryAmount) => getCoingeckoId(monetaryAmount.currency))
        );
        // base: usd, get price for all coingeckoIds
        const queryUrl = getCoingeckoQueryUrl("usd", Array.from(coingeckoIds));
        // return format: { <coingeckoId> : { <vs_id>: <price_as_number> }, ... }
        // eg. {"bitcoin":{"usd":36478},"interlay":{"usd":0.0240072}}
        const cgResponse = await fetch(queryUrl, { headers: { "accept": "application/json" } });
        const cgData = await cgResponse.json();

        const amounts = liquidityAmounts.map((monetaryAmount) => {
                const atomicAmount = monetaryAmount.toString(true);
                const amount = monetaryAmount.toString();

                const cgId = getCoingeckoId(monetaryAmount.currency);
                const usdPrice = (cgId != undefined && cgData[cgId] != undefined && cgData[cgId]["usd"] != undefined) 
                    ? cgData[cgId]["usd"]
                    : undefined;
                
                const monetaryAmountUsd = usdPrice ? getUsdMonetaryAmount(monetaryAmount, usdPrice) : undefined;
                const amountUsd = monetaryAmountUsd?.toString();
                return {
                    currency: monetaryAmount.currency,
                    coingeckoId: cgId,
                    atomicAmount,
                    amount,
                    amountUsd
                }
            });

        interbtcApi.disconnect();
        return response.status(200)
            .setHeader("content-type", "application/json")
            .setHeader("cache-control", "public, maxage=0, s-maxage=300")
            .json(amounts);
    } else {
        return response.status(400).send('Bad Request');
    }
}

export default async function (request, response) {
    return tvlLoans(request, response);
}
  