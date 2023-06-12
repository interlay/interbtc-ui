import { Currency, MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import {
  TransactionDetails as BaseTransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFee
} from '@/components';
import { TRANSACTION_FEE_AMOUNT, WRAPPED_TOKEN } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type TransactionDetailsProps = {
  totalAmount: MonetaryAmount<Currency> | undefined;
  totalAmountUSD: number;
  redeemFee: MonetaryAmount<Currency>;
};

const TransactionDetails = ({ totalAmount, totalAmountUSD, redeemFee }: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();

  return (
    <Flex direction='column' gap='spacing2'>
      <TokenInput
        placeholder='0.00'
        label='You will receive'
        isDisabled
        ticker={WRAPPED_TOKEN.ticker}
        value={totalAmount?.toString()}
        valueUSD={totalAmountUSD}
      />
      <BaseTransactionDetails>
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel='The bridge fee paid to the vaults, relayers and maintainers of the system'>
            Bridge Fee
          </TransactionDetailsDt>
          <TransactionDetailsDd>
            {redeemFee.toHuman()} {redeemFee.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(redeemFee, getTokenPrice(prices, redeemFee.currency.ticker)?.usd)})
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
      </BaseTransactionDetails>
      <BaseTransactionDetails>
        <TransactionFee
          label='Transaction Fee'
          tooltipLabel='The fee for the transaction to be included in the parachain'
          amount={TRANSACTION_FEE_AMOUNT}
        />
      </BaseTransactionDetails>
    </Flex>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
