import {
  createSubstrateAPI,
  DefaultTransactionAPI,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import { Kusama } from '@interlay/monetary-js';
import { web3FromAddress } from '@polkadot/extension-dapp';

// import { PARACHAIN_URL } from '../../constants';

// TODO: move this to config
const PARACHAIN_URL = 'wss://kusama-rpc.polkadot.io';

// Initial function transfers KSM from kusama -> kintsugi
// this will be extended to handle the reverse
const xcmTransfer = async (): Promise<void> => {
  const api = await createSubstrateAPI(PARACHAIN_URL);
  const destinationAddress = '14mJeAo9uZiqyVF7M9DMEYWSnJqGLsPpmxiCcJX8NHjaxcX9'; // Test2

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

  const beneficiary = api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          accountId32: {
            network: api.createType('XcmV0JunctionNetworkId', { any: true }),
            id: destinationAddress
          }
        })
      })
    })
  });

  const assets = api.createType('XcmVersionedMultiAssets', {
    v1: api.createType('XcmV1MultiassetMultiAssets', [{
      id: api.createType('XcmV1MultiassetAssetId', {
        concrete: api.createType('XcmV1MultiLocation', {
          parents: 0,
          interior: api.createType('XcmV1MultilocationJunctions', {
            here: true
          })
        })
      }),
      fun: api.createType('XcmV1MultiassetFungibility', {
        fungible: newMonetaryAmount(0.1, Kusama)
      })
    }])
  });

  if (window.bridge.account) {
    // Signer needs to be explicitly set for this instance of the api
    const { signer } = await web3FromAddress(window.bridge.account.toString());
    api.setSigner(signer);

    const xcmTransaction = api.tx.xcmPallet.reserveTransferAssets(dest, beneficiary, assets, 0);
    await transactionAPI.sendLogged(xcmTransaction, undefined, undefined);
  }
};

export { xcmTransfer };
