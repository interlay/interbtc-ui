import { createRelayChainApi } from './create-relay-chain-api';
import { getRelayChainBalance } from './get-relay-chain-balance';
import { getExistentialDeposit } from './get-existential-deposit';
import { transferToParachain } from './transfer-to-parachain';
import { transferToRelayChain } from './transfer-to-relay-chain';
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
  getExistentialDeposit,
  transferToParachain,
  transferToRelayChain
};
