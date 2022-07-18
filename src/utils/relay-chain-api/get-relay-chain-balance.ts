import { newMonetaryAmount } from '@interlay/interbtc-api';
import { ApiPromise } from '@polkadot/api';
import { AddressOrPair } from '@polkadot/api-base/types';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';

import { RelayChainMonetaryAmount } from './types';

const getRelayChainBalance = async (api: ApiPromise, address: AddressOrPair): Promise<RelayChainMonetaryAmount> => {
  // TODO: resolve type error related to Codec type and cast properly
  const account = (await api.query.system.account(address)) as any;

  return newMonetaryAmount(account.data.free, RELAY_CHAIN_NATIVE_TOKEN);
};

export { getRelayChainBalance };
