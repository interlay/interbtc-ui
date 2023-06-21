import { FixedPointNumber } from '@acala-network/sdk-core';
import { CrossChainTransferParams } from '@interlay/bridge';
import { ExtrinsicData } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { XCMActions } from '../types/xcm';

const getXCMExtrinsic = async (params: XCMActions): Promise<ExtrinsicData> => {
  switch (params.type) {
    case Transaction.XCM_TRANSFER: {
      const [adapter, , toChain, address, transferAmount] = params.args;

      const transferAmountString = transferAmount.toString(true);
      const transferAmountDecimals = transferAmount.currency.decimals;
      const tx = adapter.createTx({
        amount: FixedPointNumber.fromInner(transferAmountString, transferAmountDecimals),
        to: toChain,
        token: transferAmount.currency.ticker,
        address
      } as CrossChainTransferParams);

      return { extrinsic: tx };
    }
  }
};

export { getXCMExtrinsic };
