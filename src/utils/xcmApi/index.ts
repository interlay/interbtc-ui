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
import { ApiPromise } from '@polkadot/api';

const createRelayChainApi = async (): Promise<ApiPromise | undefined> => {
  let api;

  try {
    api = await createSubstrateAPI(RELAYCHAIN_URL);
  } catch (error) {
    console.log('[loadRelayChainApi] error.message => ', error.message);
  }

  return api;
};

const xcmTransfer = async (
  // Pass this in explicitly to avoid creating
  // a dependency on the interBTC api instance
  originatingAccount: AddressOrPair,
  destinationAddress: string,
  transferAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>
): Promise<void> => {
  const api = await createRelayChainApi();

  if (!api) return;

  // Create transaction api instance on the relaychain
  const transactionApi = new DefaultTransactionAPI(api, originatingAccount);

  // These functions are nested to avoid having to pass the api object
  // and arguments out of the parent function
  const createDest = () => {
    const x1 = api.createType('XcmV1Junction', { parachain: RELAYCHAIN_ID });
    const interior = api.createType('XcmV1MultilocationJunctions', { x1 });
    const v1 = api.createType('XcmV1MultiLocation', { parents: 0, interior });

    return api.createType('XcmVersionedMultiLocation', {
      v1
    });
  };

  const createBeneficiary = () => {
    const network = api.createType('XcmV0JunctionNetworkId', { any: true });
    const x1 = api.createType('XcmV1Junction', {
      accountId32: {
        network,
        id: destinationAddress
      }
    });
    const interior = api.createType('XcmV1MultilocationJunctions', { x1 });
    const v1 = api.createType('XcmV1MultiLocation', { parents: 0, interior });

    return api.createType('XcmVersionedMultiLocation', {
      v1
    });
  };

  const createAssets = () => {
    const fungible = transferAmount.toString(transferAmount.currency.rawBase);

    const fun = api.createType('XcmV1MultiassetFungibility', { fungible });
    const interior = api.createType('XcmV1MultilocationJunctions', { here: true });
    const concrete = api.createType('XcmV1MultiLocation', { parents: 0, interior });
    const id = api.createType('XcmV1MultiassetAssetId', { concrete });
    const v1 = api.createType('XcmV1MultiassetMultiAssets', [{ id, fun }]);

    return api.createType('XcmVersionedMultiAssets', {
      v1
    });
  };

  // Signer needs to be set explicitly for the new api
  const { signer } = await web3FromAddress(originatingAccount.toString());
  api.setSigner(signer);

  const dest = createDest();
  const beneficiary = createBeneficiary();
  const assets = createAssets();

  const xcmTransaction = api.tx.xcmPallet.reserveTransferAssets(dest, beneficiary, assets, 0);
  await transactionApi.sendLogged(xcmTransaction, undefined, undefined);
};

export { xcmTransfer };
