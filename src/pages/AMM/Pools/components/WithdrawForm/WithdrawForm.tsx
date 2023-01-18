import { LiquidityPool } from '@interlay/interbtc-api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { CoinIcon, CTA, Dd, Dl, DlGroup, Dt, Flex, P, TokenInput } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';
import { StyledDl } from './WithdrawForm.styles';

enum FormFields {
  WITHDRAW_AMOUNT = 'withdraw-amount'
}

type WithdrawFormData = {
  [FormFields.WITHDRAW_AMOUNT]: string;
};

type WithdrawFormProps = {
  pool: LiquidityPool;
  onChangePool?: () => void;
};

const WithdrawForm = ({ pool }: WithdrawFormProps): JSX.Element => {
  const { t } = useTranslation();
  // const { getBalance, getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  // const governanceBalance = getBalance(GOVERNANCE_TOKEN.ticker)?.free || newMonetaryAmount(0, GOVERNANCE_TOKEN);

  // const zeroAssetAmount = newMonetaryAmount(0, pooled.currency);
  // const schemaParams: PoolDepositSchemaParams = {
  //   governanceBalance,
  //   maxAmount: getAvailableBalance(pooled.currency.ticker) || zeroAssetAmount,
  //   minAmount: newMonetaryAmount(1, pooled.currency),
  //   transactionFee: TRANSACTION_FEE_AMOUNT
  // };

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<WithdrawFormData>({
    mode: 'onChange'
    // resolver: zodResolver(z.object({[FormFields.WITHDRAW_AMOUNT]: validate.amm.pool.withdraw()}))
  });

  const data = watch();
  console.log(data);
  // const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  const handleSubmit = (data: WithdrawFormData) => {
    try {
      console.log(data);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const tickers = pool.pooledCurrencies.map((currency) => currency.currency.ticker);

  const poolName = <PoolName justifyContent='center' tickers={tickers} />;

  return (
    <form onSubmit={h(handleSubmit)}>
      {poolName}
      <Flex direction='column' gap='spacing8'>
        <Flex direction='column'>
          <TokenInput
            placeholder='0.00'
            ticker={{ icons: tickers, text: 'LP Token' }}
            aria-label={t('forms.field_amount', {
              field: t('withdraw').toLowerCase()
            })}
            // TODO: get LPToken daat
            balance={0}
            valueUSD={0}
            errorMessage={getErrorMessage(errors[FormFields.WITHDRAW_AMOUNT])}
            {...register(FormFields.WITHDRAW_AMOUNT)}
          />
        </Flex>
        <Flex direction='column' gap='spacing4'>
          <P align='center' size='xs'>
            {t('amm.pools.receivable_assets')}
          </P>
          <Dl direction='column' gap='spacing2'>
            {pool.pooledCurrencies.map((pooled) => {
              return (
                <DlGroup key={pooled.currency.ticker} justifyContent='space-between'>
                  <Dt size='xs' color='primary'>
                    <Flex alignItems='center' gap='spacing1'>
                      <CoinIcon ticker={pooled.currency.ticker} />
                      {pooled.currency.ticker}
                    </Flex>
                  </Dt>
                  <Dd size='xs'>62.00 ($22.00)</Dd>
                </DlGroup>
              );
            })}
          </Dl>
        </Flex>
        <StyledDl direction='column' gap='spacing2'>
          <DlGroup justifyContent='space-between'>
            <Dt size='xs' color='primary'>
              Fees
            </Dt>
            <Dd size='xs'>
              {displayMonetaryAmount(TRANSACTION_FEE_AMOUNT)} {TRANSACTION_FEE_AMOUNT.currency.ticker} (
              {displayMonetaryAmountInUSDFormat(
                TRANSACTION_FEE_AMOUNT,
                getTokenPrice(prices, TRANSACTION_FEE_AMOUNT.currency.ticker)?.usd
              )}
              )
            </Dd>
          </DlGroup>
        </StyledDl>

        <CTA type='submit' size='large' disabled={isBtnDisabled}>
          {t('amm.pools.remove_liquidity')}
        </CTA>
      </Flex>
    </form>
  );
};

WithdrawForm.displayName = 'WithdrawForm';

export { WithdrawForm };
export type { WithdrawFormProps };
