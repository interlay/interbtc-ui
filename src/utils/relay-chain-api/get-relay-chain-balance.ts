import { ApiPromise } from '@polkadot/api';
import { AddressOrPair } from '@polkadot/api-base/types';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import { RelayChainMonetaryAmount } from './';

const getRelayChainBalance = async (
  api: ApiPromise,
  address: AddressOrPair
): Promise<RelayChainMonetaryAmount> => {
  // TODO: resolve type error related to Codec type and cast properly
  const account = await api.query.system.account(address) as any;

  return newMonetaryAmount(account.data.free, COLLATERAL_TOKEN);
};

export { getRelayChainBalance };
