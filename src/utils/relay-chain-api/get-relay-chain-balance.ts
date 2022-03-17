import { ApiPromise } from '@polkadot/api';
import { AddressOrPair } from '@polkadot/api-base/types';
import { CollateralUnit, newMonetaryAmount } from '@interlay/interbtc-api';
import {
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';
import { COLLATERAL_TOKEN } from 'config/relay-chains';
import { RelayChainMonetaryAmount } from './';

const getRelayChainBalance = async (
  api: ApiPromise,
  address: AddressOrPair
): Promise<RelayChainMonetaryAmount> => {
  const account = await api.query.system.account(address) as any;

  return newMonetaryAmount(account.data.free, COLLATERAL_TOKEN);
};

export { getRelayChainBalance };
