import { BaseCrossChainAdapter } from '@interlay/bridge/build/base-chain-adapter';
import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { ChainData } from '@/types/chains';

import { Transaction } from '.';

interface XCMTransferAction {
  type: Transaction.XCM_TRANSFER;
  args: [
    adapter: BaseCrossChainAdapter,
    fromChain: ChainData,
    toChain: ChainData,
    destinatary: string,
    transferAmount: MonetaryAmount<CurrencyExt>
  ];
}

type XCMActions = XCMTransferAction;

export type { XCMActions };
