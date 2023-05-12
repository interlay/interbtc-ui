import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface TransferAction extends TransactionAction {
  type: Transaction.TRANSFER;
  args: Parameters<InterBtcApi['tokens']['transfer']>;
}

type TokensActions = TransferAction;

export type { TokensActions };
