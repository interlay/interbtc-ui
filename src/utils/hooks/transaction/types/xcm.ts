import { ChainName } from '@interlay/bridge';
import { BaseCrossChainAdapter } from '@interlay/bridge/build/base-chain-adapter';
import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { Transaction, TransactionAction } from '.';

interface XCMTransferAction extends TransactionAction {
  type: Transaction.XCM_TRANSFER;
  args: [
    adapter: BaseCrossChainAdapter,
    fromChain: ChainName,
    toChain: ChainName,
    destinatary: string,
    transferAmount: MonetaryAmount<CurrencyExt>
  ];
}

type XCMActions = XCMTransferAction;

export type { XCMActions };
