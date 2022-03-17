import { createRelayChainApi } from './create-relay-chain-api';
import { getRelayChainBalance } from './get-relay-chain-balance';
import { transferToParachain } from './transfer-to-parachain';
import {
  RelayChainApi,
  RelayChainMonetaryAmount
} from './types';

export type {
  RelayChainApi,
  RelayChainMonetaryAmount
};

export {
  createRelayChainApi,
  getRelayChainBalance,
  transferToParachain
};
