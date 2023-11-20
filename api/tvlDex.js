import { createInterBtcApi } from "@interlay/interbtc-api";

const tvlDex = async (request, response) => {
    if (request.method === 'GET') {
        const interbtcApi = await createInterBtcApi(REACT_APP_RELAY_CHAIN_URL, REACT_APP_BITCOIN_NETWORK);

        interbtcApi.disconnect();
        return response.status(200).send(`OK. (chain url ${REACT_APP_RELAY_CHAIN_URL} / newtork ${REACT_APP_BITCOIN_NETWORK}`);
    } else {
        return response.status(400).send('Bad Request');
    }
}

export default async function (request, response) {
    return tvlDex(request, response);
}
  