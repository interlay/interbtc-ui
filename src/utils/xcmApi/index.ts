import {
  createSubstrateAPI,
  DefaultTransactionAPI
} from '@interlay/interbtc-api';

// import { PARACHAIN_URL } from '../../constants';

// TODO: move this to config
const PARACHAIN_URL = 'wss://kusama-rpc.polkadot.io';

// Initial function transfers KSM from kusama -> kintsugi
// this will be extended to handle the reverse
const xcmTransfer = async (): Promise<void> => {
  const api = await createSubstrateAPI(PARACHAIN_URL);
  const transactionAPI = new DefaultTransactionAPI(api, window.bridge.account);

  const dest = api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          parachain: 2092
        })
      })
    })
  });

  const benificiary = api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          accountId32: {
            network: api.createType('XcmV0JunctionNetworkId', { any: true }),
            id: window.bridge.account
          }
        })
      })
    })
  });

  console.log('api', api, 'transactionAPI', transactionAPI, 'dest', dest, 'benificiary', benificiary);
};

export { xcmTransfer };
