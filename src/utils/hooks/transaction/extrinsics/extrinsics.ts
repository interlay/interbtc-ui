import { ExtrinsicData } from '@interlay/interbtc-api';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';

import { Transaction, TransactionActions } from '../types';
import { getLibExtrinsic } from './lib';
import { getXCMExtrinsic } from './xcm';

/**
 * SUMMARY: Maps each transaction to the correct lib call,
 * while maintaining a safe-type check.
 * HOW TO ADD NEW TRANSACTION: find the correct module to add the transaction
 * in the types folder. In case you are adding a new type to the loans modules, go
 * to types/loans and add your new transaction as an action. This actions needs to also be added to the
 * types/index TransactionActions type. After that, you should be able to add it to the function.
 * @param {TransactionActions} params contains the type of transaction and
 * the related args to call the mapped lib call
 * @return {Promise<ExtrinsicData>} every transaction return an extrinsic
 */
const getExtrinsic = async (params: TransactionActions): Promise<ExtrinsicData> => {
  switch (params.type) {
    case Transaction.XCM_TRANSFER:
      return getXCMExtrinsic(params);
    default:
      return getLibExtrinsic(params);
  }
};

/**
 * The status where we want to be notified on the transaction completion
 * @param {Transaction} type type of transaction
 * @return {ExtrinsicStatus.type} transaction status
 */
const getStatus = (type: Transaction): ExtrinsicStatus['type'] => {
  switch (type) {
    // When requesting a replace, wait for the finalized event because we cannot revert BTC transactions.
    // For more details see: https://github.com/interlay/interbtc-api/pull/373#issuecomment-1058949000
    case Transaction.ISSUE_REQUEST:
    case Transaction.REDEEM_REQUEST:
    case Transaction.REPLACE_REQUEST:
      return 'Finalized';
    default:
      return 'InBlock';
  }
};

export { getExtrinsic, getStatus };
