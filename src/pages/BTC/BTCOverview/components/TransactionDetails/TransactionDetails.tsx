import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { useId } from '@react-aria/utils';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Alert, Flex, TokenInput } from '@/component-library';
import {
  TransactionDetails as BaseTransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails,
  TransactionFeeDetailsProps,
  TransactionSelectToken,
  TransactionSelectTokenProps
} from '@/components';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { SelectCurrencyFilter, useSelectCurrency } from '@/hooks/use-select-currency';
import { getTokenPrice } from '@/utils/helpers/prices';

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
  securityDepositSelectProps?: TransactionSelectTokenProps;
  showInsufficientSecurityBalance?: boolean;
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
  feeDetailsProps,
  securityDepositSelectProps,
  showInsufficientSecurityBalance
}: TransactionDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  const griefingCollateralErrorMessageId = useId();

  const { items: griefingCollateralCurrencies } = useSelectCurrency(
    SelectCurrencyFilter.ISSUE_GRIEFING_COLLATERAL_CURRENCY
  );

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
              label={t('btc.compensation_amount')}
              ticker={compensationAmount.currency.ticker}
              value={compensationAmount?.toString()}
              valueUSD={compensationAmountUSD}
            />
          </>
        )}
      </Flex>
      <BaseTransactionDetails>
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel={t('btc.fee_paids_to_vaults_relayers_maintainers')}>
            {t('btc.bridge_fee')}
          </TransactionDetailsDt>
          <TransactionDetailsDd>
            {bridgeFee.toHuman()} {bridgeFee.currency.ticker} (
            {displayMonetaryAmountInUSDFormat(bridgeFee, getTokenPrice(prices, bridgeFee.currency.ticker)?.usd)})
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
        {securityDeposit && (
          <>
            {securityDepositSelectProps && (
              <TransactionSelectToken
                label={t('btc.security_deposit_token')}
                items={griefingCollateralCurrencies}
                aria-describedby={griefingCollateralErrorMessageId}
                validationState={showInsufficientSecurityBalance ? 'invalid' : 'valid'}
                {...securityDepositSelectProps}
              />
            )}
            <TransactionDetailsGroup>
              <TransactionDetailsDt tooltipLabel={t('btc.security_deposit_is_a_denial_of_service_protection')}>
                {t('btc.security_deposit')}
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
      {showInsufficientSecurityBalance && (
        <Alert id={griefingCollateralErrorMessageId} status='error'>
          {t('forms.ensure_adequate_amount_left_to_cover_action', {
            action: t('btc.security_deposit_token').toLowerCase()
          })}
        </Alert>
      )}
      {bitcoinNetworkFee && (
        <BaseTransactionDetails>
          <TransactionDetailsGroup>
            <TransactionDetailsDt tooltipLabel={t('btc.fee_paids_to_vaults_relayers_maintainers')}>
              {t('btc.bitcoin_network_fee')}
            </TransactionDetailsDt>
            <TransactionDetailsDd>
              {bitcoinNetworkFee.toHuman()} {bitcoinNetworkFee.currency.ticker} (
              {displayMonetaryAmountInUSDFormat(
                bitcoinNetworkFee,
                getTokenPrice(prices, bitcoinNetworkFee.currency.ticker)?.usd
              )}
              )
            </TransactionDetailsDd>
          </TransactionDetailsGroup>
        </BaseTransactionDetails>
      )}
      {feeDetailsProps && <TransactionFeeDetails {...feeDetailsProps} />}
    </Flex>
  );
};

export { TransactionDetails };
export type { TransactionDetailsProps };
