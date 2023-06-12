import { Currency, MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import {
  PlusDivider,
  TransactionDetails as BaseTransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFee
} from '@/components';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

type TransactionDetailsProps = {
  totalAmount: MonetaryAmount<Currency>;
  totalAmountUSD: number;
  totalTicker: string;
  compensationAmount?: MonetaryAmount<Currency>;
  compensationAmountUSD?: number;
  bridgeFee: MonetaryAmount<Currency>;
  securityDeposit?: MonetaryAmount<Currency>;
  bitcoinNetworkFee?: MonetaryAmount<Currency>;
};

const TransactionDetails = ({
  totalAmount,
  totalAmountUSD,
  totalTicker,
  compensationAmount,
  compensationAmountUSD,
  bridgeFee,
  securityDeposit,
  bitcoinNetworkFee
}: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();

  return (
    <Flex direction='column' gap='spacing2'>
      <Flex direction='column' gap='spacing6'>
        <TokenInput
          placeholder='0.00'
          label='You will receive'
          isDisabled
          ticker={totalTicker}
          value={totalAmount?.toString()}
          valueUSD={totalAmountUSD}
        />
        {compensationAmount && (
          <>
            <PlusDivider />
            <TokenInput
              placeholder='0.00'
              isDisabled
              aria-label='Compensation amount'
              ticker={compensationAmount.currency.ticker}
              value={compensationAmount?.toString()}
              valueUSD={compensationAmountUSD}
            />
          </>
        )}
      </Flex>
      <BaseTransactionDetails>
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel='The bridge fee paid to the vaults, relayers and maintainers of the system'>
            Bridge Fee
          </TransactionDetailsDt>
          <TransactionDetailsDd>
            {bridgeFee.toHuman()} {bridgeFee.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(bridgeFee, getTokenPrice(prices, bridgeFee.currency.ticker)?.usd)})
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
        {securityDeposit && (
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
        )}
      </BaseTransactionDetails>
      <BaseTransactionDetails>
        {bitcoinNetworkFee ? (
          <TransactionFee label='Bitcoin Network Fee' amount={bitcoinNetworkFee} />
        ) : (
          <TransactionFee
            label='Transaction Fee'
            tooltipLabel='The fee for the transaction to be included in the parachain'
            amount={TRANSACTION_FEE_AMOUNT}
          />
        )}
      </BaseTransactionDetails>
    </Flex>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
