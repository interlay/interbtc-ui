import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Dd, DlGroup, Dt, Tooltip } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledDl, StyledInformationCircle } from './IssueForm.styles';

// eslint-disable-next-line @typescript-eslint/ban-types
type TransactionDetailsProps = {};

// eslint-disable-next-line no-empty-pattern
const TransactionDetails = ({}: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();

  return (
    <StyledDl direction='column' gap='spacing2'>
      <DlGroup justifyContent='space-between'>
        <Dt>
          Bridge Fee
          <Tooltip label='The bridge fee paid to the vaults, relayers and maintainers of the system'>
            <StyledInformationCircle size='s' />
          </Tooltip>
        </Dt>
        <Dd>
          {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(
            TRANSACTION_FEE_AMOUNT,
            getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
          )}
          )
        </Dd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>
          Security Deposit
          <Tooltip label='The security deposit is a denial-of-service protection for Vaults that is refunded to you after the minting process is completed'>
            <StyledInformationCircle size='s' />
          </Tooltip>
        </Dt>
        <Dd>
          {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(
            TRANSACTION_FEE_AMOUNT,
            getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
          )}
          )
        </Dd>
      </DlGroup>
      <DlGroup justifyContent='space-between'>
        <Dt>
          Transaction Fee
          <Tooltip label='The fee for the transaction to be included in the parachain'>
            <StyledInformationCircle size='s' />
          </Tooltip>
        </Dt>
        <Dd>
          {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
          {displayMonetaryAmountInUSDFormat(
            TRANSACTION_FEE_AMOUNT,
            getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
          )}
          )
        </Dd>
      </DlGroup>
    </StyledDl>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
