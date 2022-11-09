import { BorrowPosition, CurrencyExt, LendPosition, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';

import { Prices } from '../use-get-prices';

type Field<T> = T extends LendPosition
  ? Extract<keyof LendPosition, 'earnedInterest' | 'earnedReward' | 'amount'>
  : Extract<keyof BorrowPosition, 'earnedReward' | 'amount'>;

/**
 * This function uses the value specified in the object key `field` param
 * to calculate total USD amount
 * @param {Field<T>} field The object key to be summed.
 * @param {T[]} positions The data to be used in the sum.
 * @param {Prices} prices The prices data needed to calculate the total USD value
 * @return {Big} Summed USD amount
 */
const getPositionsSumOfFieldsInUSD = <T extends LendPosition | BorrowPosition>(
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

// MEMO: sums all the earned rewards for both lend and borrow positions
const getTotalEarnedRewards = (
  lendPositions: LendPosition[] = [],
  borrowPositions: BorrowPosition[] = []
): MonetaryAmount<CurrencyExt> =>
  [...lendPositions, ...borrowPositions].reduce(
    (total, position) => (position.earnedReward ? total.add(position.earnedReward) : total),
    newMonetaryAmount(0, GOVERNANCE_TOKEN)
  );

export { getPositionsSumOfFieldsInUSD, getTotalEarnedRewards };
