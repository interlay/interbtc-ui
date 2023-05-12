import { ExtrinsicData } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from './types';

const getExtrinsic = async (params: TransactionActions): Promise<ExtrinsicData> => {
  switch (params.type) {
    case Transaction.SWAP: {
      return window.bridge.amm.swap(...params.args);
    }
    case Transaction.POOL_ADD_LIQUIDITY: {
      return window.bridge.amm.addLiquidity(...params.args);
    }
    case Transaction.POOL_REMOVE_LIQUIDITY: {
      return window.bridge.amm.removeLiquidity(...params.args);
    }
    case Transaction.POOL_CLAIM_REWARDS: {
      return window.bridge.amm.claimFarmingRewards(...params.args);
    }
  }
};

const getExpectedStatus = (type: Transaction): ExtrinsicStatus['type'] => {
  switch (type) {
    case Transaction.ISSUE_REQUEST:
    case Transaction.REDEEM_REQUEST:
      return 'Finalized';
    default:
      return 'InBlock';
  }
};

export { getExpectedStatus, getExtrinsic };
