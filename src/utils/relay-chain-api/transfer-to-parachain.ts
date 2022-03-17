import { DefaultTransactionAPI } from '@interlay/interbtc-api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { AddressOrPair } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/keyring';

import { PARACHAIN_ID } from '../../constants';
import { RelayChainMonetaryAmount } from './';

const createDest = (api: ApiPromise) => {
  const x1 = api.createType('XcmV1Junction', { parachain: PARACHAIN_ID });
  const interior = api.createType('XcmV1MultilocationJunctions', { x1 });
  const v1 = api.createType('XcmV1MultiLocation', { parents: 0, interior });

  return api.createType('XcmVersionedMultiLocation', {
    v1
  });
};

const createBeneficiary = (api: ApiPromise, id: string) => {
  const network = api.createType('XcmV0JunctionNetworkId', { any: true });
  const x1 = api.createType('XcmV1Junction', {
    accountId32: {
      network,
      id: decodeAddress(id)
    }
  });
  const interior = api.createType('XcmV1MultilocationJunctions', { x1 });
  const v1 = api.createType('XcmV1MultiLocation', { parents: 0, interior });

  return api.createType('XcmVersionedMultiLocation', {
    v1
  });
};

const createAssets = (api: ApiPromise, transferAmount: RelayChainMonetaryAmount) => {
  const fungible = transferAmount.toString();
  const fun = api.createType('XcmV1MultiassetFungibility', { fungible });
  const interior = api.createType('XcmV1MultilocationJunctions', { here: true });
  const concrete = api.createType('XcmV1MultiLocation', { parents: 0, interior });
  const id = api.createType('XcmV1MultiassetAssetId', { concrete });
  const v1 = api.createType('XcmV1MultiassetMultiAssets', [{ id, fun }]);

  return api.createType('XcmVersionedMultiAssets', {
    v1
  });
};

// Originating account is passed into avoid creating a dependency on the interBTC api instance
const transferToParachain = async (
  api: ApiPromise,
  originatingAccount: AddressOrPair,
  destinationAddress: string,
  transferAmount: RelayChainMonetaryAmount
): Promise<void> => {
  // Create transaction api instance on the relaychain
  const transactionApi = new DefaultTransactionAPI(api, originatingAccount);

  // TODO: why does Signer needs to be set explicitly for the new api?
  // This should be handled automatically by signAndSend
  const { signer } = await web3FromAddress(originatingAccount.toString());
  api.setSigner(signer);

  const dest = createDest(api);
  const beneficiary = createBeneficiary(api, destinationAddress);
  const assets = createAssets(api, transferAmount);

  const xcmTransaction = api.tx.xcmPallet.reserveTransferAssets(dest, beneficiary, assets, 0);

  await transactionApi.sendLogged(xcmTransaction);
};

export { transferToParachain };
