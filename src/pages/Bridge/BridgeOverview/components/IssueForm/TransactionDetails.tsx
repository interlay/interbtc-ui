import { Currency, MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import {
  TransactionDetails as BaseTransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFee
} from '@/components';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type TransactionDetailsProps = { issueFee: MonetaryAmount<Currency>; securityDeposit: MonetaryAmount<Currency> };

const TransactionDetails = ({ issueFee, securityDeposit }: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();

  return (
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
      <TransactionFee
        label='Transaction Fee'
        tooltipLabel='The fee for the transaction to be included in the parachain'
        amount={TRANSACTION_FEE_AMOUNT}
      />
    </BaseTransactionDetails>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
