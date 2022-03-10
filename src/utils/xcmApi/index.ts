import {
  createSubstrateAPI,
  CollateralUnit,
  DefaultTransactionAPI
} from '@interlay/interbtc-api';
import {
  Currency,
  MonetaryAmount
} from '@interlay/monetary-js';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { AddressOrPair } from '@polkadot/api/types';

import {
  RELAYCHAIN_URL,
  RELAYCHAIN_ID
} from '../../constants';

const xcmTransfer = async (
  // Pass this in explicitly to avoid creating
  // a dependency on the interBCT api instance
  originatingAccount: AddressOrPair,
  destinationAddress: string,
  transferAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>
): Promise<void> => {
  // Create api and transaction api instances on the parachain
  const api = await createSubstrateAPI(RELAYCHAIN_URL);
  const transactionApi = new DefaultTransactionAPI(api, originatingAccount);

  // Signer needs to be set explicitly for the new api
  const { signer } = await web3FromAddress(originatingAccount.toString());
  api.setSigner(signer);

  const dest = api.createType('XcmVersionedMultiLocation', {
    v1: api.createType('XcmV1MultiLocation', {
      parents: 0,
      interior: api.createType('XcmV1MultilocationJunctions', {
        x1: api.createType('XcmV1Junction', {
          parachain: RELAYCHAIN_ID
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
        fungible: transferAmount.toString(transferAmount.currency.rawBase)
      })
    }])
  });

  const xcmTransaction = api.tx.xcmPallet.reserveTransferAssets(dest, beneficiary, assets, 0);
  await transactionApi.sendLogged(xcmTransaction, undefined, undefined);
};

export { xcmTransfer };
