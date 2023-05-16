import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface TokensTransferAction extends TransactionAction {
  type: Transaction.TOKENS_TRANSFER;
  args: Parameters<InterBtcApi['tokens']['transfer']>;
}

type TokensActions = TokensTransferAction;

export type { TokensActions };
