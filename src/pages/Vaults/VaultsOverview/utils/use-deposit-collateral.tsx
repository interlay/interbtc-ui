import { CollateralCurrencyExt, CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type UseDepositCollateral = {
  collateral: {
    currency: CurrencyExt;
    isGovernanceToken: boolean;
    price: {
      usd: number;
    };
    balance: {
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
    min: {
      amount: string;
      usd: string;
      raw: MonetaryAmount<CurrencyExt>;
    };
  };
};

const useDepositCollateral = (
  collateralCurrency: CollateralCurrencyExt,
  minCollateral: MonetaryAmount<CollateralCurrencyExt>
): UseDepositCollateral => {
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  const collateralUSDAmount = getTokenPrice(prices, collateralCurrency.ticker)?.usd || 0;

  const isGovernanceCollateral = collateralCurrency === GOVERNANCE_TOKEN;
  const collateralTokenBalance =
    getAvailableBalance(collateralCurrency.ticker) || newMonetaryAmount(0, collateralCurrency);

  return {
    collateral: {
      currency: collateralCurrency,
      isGovernanceToken: isGovernanceCollateral,
      price: {
        usd: collateralUSDAmount
      },
      balance: {
        amount: collateralTokenBalance.toString(),
        usd: displayMonetaryAmountInUSDFormat(collateralTokenBalance, collateralUSDAmount),
        raw: collateralTokenBalance
      },
      min: {
        amount: displayMonetaryAmount(minCollateral),
        usd: displayMonetaryAmountInUSDFormat(minCollateral, collateralUSDAmount),
        raw: minCollateral
      }
    }
  };
};

export { useDepositCollateral };
