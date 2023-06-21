import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Flex, TokenInput } from '@/component-library';
import {
  TransactionDetails as BaseTransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails,
  TransactionFeeDetailsProps
} from '@/components';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { StyledPlusDivider } from './TransactionDetails.style';

type TransactionDetailsProps = {
  totalAmount: MonetaryAmount<Currency>;
  totalAmountUSD: number;
  totalTicker: string;
  compensationAmount?: MonetaryAmount<Currency>;
  compensationAmountUSD?: number;
  bridgeFee: MonetaryAmount<Currency>;
  securityDeposit?: MonetaryAmount<Currency>;
  bitcoinNetworkFee?: MonetaryAmount<Currency>;
  feeDetailsProps?: TransactionFeeDetailsProps;
};

const TransactionDetails = ({
  totalAmount,
  totalAmountUSD,
  totalTicker,
  compensationAmount,
  compensationAmountUSD,
  bridgeFee,
  securityDeposit,
  bitcoinNetworkFee,
  feeDetailsProps
}: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='spacing2'>
      <Flex direction='column'>
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
            <StyledPlusDivider marginTop='spacing2' />
            <TokenInput
              placeholder='0.00'
              isDisabled
              label={t('bridge.compensation_amount')}
              ticker={compensationAmount.currency.ticker}
              value={compensationAmount?.toString()}
              valueUSD={compensationAmountUSD}
            />
          </>
        )}
      </Flex>
      <BaseTransactionDetails>
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel={t('bridge.fee_paids_to_vaults_relayers_maintainers')}>
            {t('bridge.bridge_fee')}
          </TransactionDetailsDt>
          <TransactionDetailsDd>
            {bridgeFee.toHuman()} {bridgeFee.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(bridgeFee, getTokenPrice(prices, bridgeFee.currency.ticker)?.usd)})
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
        {securityDeposit && (
          <>
            <TransactionDetailsGroup>
              <TransactionDetailsDt tooltipLabel={t('bridge.security_deposit_is_a_denial_of_service_protection')}>
                {t('bridge.security_deposit')}
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
          </>
        )}
      </BaseTransactionDetails>
      {bitcoinNetworkFee ? (
        <TransactionFeeDetails label={t('bridge.bitcoin_network_fee')} amount={bitcoinNetworkFee} />
      ) : (
        feeDetailsProps && <TransactionFeeDetails {...feeDetailsProps} />
      )}
    </Flex>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
