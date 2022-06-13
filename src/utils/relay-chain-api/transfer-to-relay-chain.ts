import { DefaultTransactionAPI, newCurrencyId, tickerToCurrencyIdLiteral } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { decodeAddress } from '@polkadot/keyring';
import { AddressOrPair } from '@polkadot/api/types';

import { RELAY_CHAIN_NATIVE_TOKEN } from 'config/relay-chains';
import { TRANSFER_WEIGHT } from './constants';
import { RelayChainMonetaryAmount } from './';

const createDest = (api: ApiPromise, id: string) => {
  const network = api.createType('XcmV0JunctionNetworkId', { any: true });
  const x1 = api.createType('XcmV1Junction', { accountId32: { network, id: decodeAddress(id) } });
  const interior = api.createType('XcmV1MultilocationJunctions', { x1 });
  const v1 = api.createType('XcmV1MultiLocation', { parents: 1, interior });

  return api.createType('XcmVersionedMultiLocation', { v1 });
};

const transferToRelayChain = async (
  api: ApiPromise,
  originatingAccount: AddressOrPair,
  id: string,
  transferAmount: RelayChainMonetaryAmount
): Promise<void> => {
  const transactionApi = new DefaultTransactionAPI(api, originatingAccount);

  const dest = createDest(api, id);
  // TODO: does this need to be done here, or can it be imported from the lib?
  const currencyId = newCurrencyId(api, tickerToCurrencyIdLiteral(RELAY_CHAIN_NATIVE_TOKEN.ticker));

  const xcmTransaction = api.tx.xTokens.transfer(currencyId, transferAmount.toString(), dest, TRANSFER_WEIGHT);

  await transactionApi.sendLogged(xcmTransaction);
};

export { transferToRelayChain };
