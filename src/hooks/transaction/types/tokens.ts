import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '.';

interface TokensTransferAction {
  type: Transaction.TOKENS_TRANSFER;
  args: Parameters<InterBtcApi['tokens']['transfer']>;
}

type TokensActions = TokensTransferAction;

export type { TokensActions };
