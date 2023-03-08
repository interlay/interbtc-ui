import { CurrencyExt, LoanAsset } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { useCallback } from 'react';

import { convertMonetaryBtcToUSD } from '@/common/utils/utils';
import { LoanAction } from '@/types/loans';
import { useGetAccountLendingStatistics } from '@/utils/hooks/api/loans/use-get-account-lending-statistics';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type LoanActionData = { type: LoanAction; amount: MonetaryAmount<CurrencyExt>; asset: LoanAsset };

interface UseAccountBorrowLimit {
  data: Big | undefined;
  getBorrowLimitUSD: (loanAction: LoanActionData) => Big | undefined;
}

const useAccountBorrowLimit = (): UseAccountBorrowLimit => {
  const prices = useGetPrices();
  const {
    data: { statistics }
  } = useGetAccountLendingStatistics();

  /**
   * This method computes how the borrow limit will change if
   * asset is withdrawn or deposited to protocol.
   * @param {LoanActionData} loanAction The data related to loan action
   * @note Call only after the prices and positions statistics are loaded.
   * @returns New borrow limit in USD after the transaction is done.
   */
  const getBorrowLimitUSD = useCallback(
    ({ type, amount }: LoanActionData): Big | undefined => {
      if (prices === undefined || statistics === undefined) {
        return undefined;
      }

      const newBorrowLimitBtc = statistics.calculateBorrowLimitBtcChange(type, amount);
      return convertMonetaryBtcToUSD(newBorrowLimitBtc, prices);
    },
    [prices, statistics]
  );

  const data =
    prices !== undefined && statistics !== undefined
      ? convertMonetaryBtcToUSD(statistics.borrowLimitBtc, prices)
      : undefined;

  return {
    data,
    getBorrowLimitUSD
  };
};

export { useAccountBorrowLimit };
export type { UseAccountBorrowLimit };
