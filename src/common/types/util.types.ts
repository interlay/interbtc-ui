import { Store, CombinedState } from 'redux';
import { u256 } from '@polkadot/types/primitive';
import { BitcoinAmount, MonetaryAmount, Currency } from '@interlay/monetary-js';
import { CollateralUnit } from '@interlay/interbtc-api';

import { GovernanceTokenMonetaryAmount } from 'config/relay-chains';
import { GeneralActions, RedeemActions, VaultActions } from './actions.types';
import { rootReducer } from '../reducers/index';
import { RedeemState } from './redeem.types';
import { VaultState } from './vault.types';

export interface StatusUpdate {
  id: u256;
  timestamp: string;
  proposedStatus: string;
  currentStatus: string;
  proposedChanges: string;
  blockHash: string;
  // eslint-disable-next-line camelcase
  aye_vote_stake: string;
  // eslint-disable-next-line camelcase
  nay_vote_stake: string;
  result: string;
  proposer: string;
  message: string;
}

export interface DashboardStatusUpdateInfo {
  id: string;
  timestamp: string;
  proposedStatus: string;
  addError: string;
  removeError: string;
  btcBlockHash: string;
  yeas: number;
  nays: number;
  executed: boolean;
  rejected: boolean;
  forced: boolean;
}

export enum ParachainStatus {
  Loading,
  Error,
  Running,
  Shutdown
}

export type Prices = {
  bitcoin:
    | {
        usd: number;
      }
    | undefined;
  relayChainNativeToken:
    | {
        usd: number;
      }
    | undefined;
  governanceToken:
    | {
        usd: number;
      }
    | undefined;
};

export type GeneralState = {
  bridgeLoaded: boolean;
  vaultClientLoaded: boolean;
  showAccountModal: boolean;
  address: string;
  totalWrappedTokenAmount: BitcoinAmount;
  totalLockedCollateralTokenAmount: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  wrappedTokenBalance: BitcoinAmount;
  wrappedTokenTransferableBalance: BitcoinAmount;
  collateralTokenBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  collateralTokenTransferableBalance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>;
  governanceTokenBalance: GovernanceTokenMonetaryAmount;
  governanceTokenTransferableBalance: GovernanceTokenMonetaryAmount;
  extensions: string[];
  btcRelayHeight: number;
  bitcoinHeight: number;
  parachainStatus: ParachainStatus;
  prices: Prices;
};

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
  general: GeneralState;
  redeem: RedeemState;
  vault: VaultState;
};

export type dispatcher = {
  // eslint-disable-next-line
  dispatch: {};
};

export type StoreState = Store<CombinedState<StoreType>, GeneralActions | RedeemActions | VaultActions> & dispatcher;

export type TimeDataPoint = {
  x: Date;
  y: number;
};

export type RelayedBlock = {
  height: string;
  hash: string;
  relayTs: string;
};

export enum TokenType {
  COLLATERAL = 'collateral',
  GOVERNANCE = 'governance',
  WRAPPED = 'wrapped'
}
