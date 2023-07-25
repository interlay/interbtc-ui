import { CollateralCurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import { u256 } from '@polkadot/types/primitive';
import { CombinedState, Store } from 'redux';

import { TransactionStatus } from '@/hooks/transaction/types';

import { rootReducer } from '../reducers/index';
import { GeneralActions, RedeemActions, VaultActions } from './actions.types';
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

export type Notification = {
  status: TransactionStatus;
  description: string;
  date: Date;
  url?: string;
};

export type TransactionModalData = {
  variant: TransactionStatus;
  timestamp?: number;
  description?: string;
  url?: string;
  errorMessage?: string;
};

export type GeneralState = {
  bridgeLoaded: boolean;
  vaultClientLoaded: boolean;
  showAccountModal: boolean;
  isSignTermsModalOpen: boolean;
  isBuyModalOpen: boolean;
  totalWrappedTokenAmount: BitcoinAmount;
  totalLockedCollateralTokenAmount: MonetaryAmount<CollateralCurrencyExt>;
  btcRelayHeight: number;
  bitcoinHeight: number;
  parachainStatus: ParachainStatus;
  notifications: Record<string, Notification[]>;
  transactionModal: {
    isOpen: boolean;
    data: TransactionModalData;
  };
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
  RelayChainNative = 'relay-chain-native',
  Governance = 'governance',
  Wrapped = 'wrapped'
}
