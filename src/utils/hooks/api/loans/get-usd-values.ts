import { BorrowPosition, LendPosition } from '@interlay/interbtc-api';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import { Prices } from '../use-get-prices';

type Field<T> = T extends LendPosition
  ? Extract<keyof LendPosition, 'earnedInterest' | 'earnedReward' | 'amount'>
  : Extract<keyof BorrowPosition, 'earnedReward' | 'amount'>;

const getPositionsTotalUSDField = <T extends LendPosition | BorrowPosition>(
  field: Field<T>,
  positions: T[],
  prices: Prices
): Big =>
  positions.reduce((totalValue: Big, position: T) => {
    const price = getTokenPrice(prices, position.currency.ticker)?.usd;

    if (price === undefined) {
      console.error(`useGetAccountCollateralization: No exchange rate found for currency: ${position.currency.name}`);
    }

    const positionUSDValue = convertMonetaryAmountToValueInUSD(position[field as 'amount'], price);
    return positionUSDValue === null ? totalValue : totalValue.add(positionUSDValue);
  }, Big(0));

export { getPositionsTotalUSDField };
