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
  issueFee: MonetaryAmount<Currency>;
  securityDeposit: MonetaryAmount<Currency>;
};

const TransactionDetails = ({
  totalAmount,
  totalAmountUSD,
  issueFee,
  securityDeposit
}: TransactionDetailsProps): JSX.Element => {
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
            {issueFee.toHuman()} {issueFee.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(issueFee, getTokenPrice(prices, issueFee.currency.ticker)?.usd)})
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel='The security deposit is a denial-of-service protection for Vaults that is refunded to you after the minting process is completed'>
            Security Deposit
          </TransactionDetailsDt>
          <TransactionDetailsDd>
            {securityDeposit.toHuman()} {securityDeposit.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(
              securityDeposit,
              getTokenPrice(prices, securityDeposit.currency.ticker)?.usd
            )}
            )
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
