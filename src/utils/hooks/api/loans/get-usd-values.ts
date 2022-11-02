import { LendPosition, LoanPosition } from '@interlay/interbtc-api';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import { Prices } from '../use-get-prices';

const getTotalEarnedInterestUSDValue = (lendPositions: LendPosition[], prices: Prices): Big =>
  lendPositions.reduce((totalValue: Big, position: LendPosition) => {
    const { currency, earnedInterest } = position;
    const price = getTokenPrice(prices, currency.ticker)?.usd;

    if (price === undefined) {
      console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
    }

    const positionUSDValue = convertMonetaryAmountToValueInUSD(earnedInterest, price);
    return positionUSDValue === null ? totalValue : totalValue.add(positionUSDValue);
  }, Big(0));

const getTotalUSDValueOfPositions = (positions: LoanPosition[], prices: Prices): Big =>
  positions.reduce((totalValue: Big, position: LoanPosition) => {
    const { currency, amount } = position;
    const price = getTokenPrice(prices, currency.ticker)?.usd;

    if (price === undefined) {
      console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${currency.name}`);
    }

    const positionUSDValue = convertMonetaryAmountToValueInUSD(amount, price);
    return positionUSDValue === null ? totalValue : totalValue.add(positionUSDValue);
  }, Big(0));

export { getTotalEarnedInterestUSDValue, getTotalUSDValueOfPositions };
