import { TFunction, useTranslation } from 'react-i18next';

import { displayMonetaryAmount, displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { Card, CTA, Dd, Dl, DlGroup, Dt, Flex, TokenInput } from '@/component-library';
import { TRANSACTION_FEE_AMOUNT } from '@/config/relay-chains';
import { PoolAction } from '@/types/pools';
import { getTokenPrice } from '@/utils/helpers/prices';
import { AccountLiquidityPool } from '@/utils/hooks/api/amm/use-get-account-pools';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { PoolName } from '../PoolName';

// type LoanSchemaParams = LoanLendSchemaParams & LoanWithdrawSchemaParams;

// enum FormFields {
//   LEND_AMOUNT = 'lend-amount',
//   WITHDRAW_AMOUNT = 'withdraw-amount'
// }

const getData = (t: TFunction, variant: PoolAction) =>
  ({
    deposit: {
      content: {
        btn: t('amm.pools.add_liquidity'),
        fieldAriaLabel: t('forms.field_amount', { field: t('deposit').toLowerCase() })
      }

      // formField: FormFields.LEND_AMOUNT
    },
    withdraw: {
      content: {
        btn: t('amm.pools.remove_liquidity'),
        fieldAriaLabel: t('forms.field_amount', { field: t('withdraw').toLowerCase() })
      }

      // formField: FormFields.WITHDRAW_AMOUNT
    }
  }[variant]);

// type PoolFormData = Record<string, string>

type PoolFormProps = {
  liquidityPool: AccountLiquidityPool;
  variant: PoolAction;
  onChangePool?: () => void;
};

const PoolForm = ({ variant, liquidityPool }: PoolFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { getAvailableBalance } = useGetBalances();
  const prices = useGetPrices();

  // const schemaParams: LoanSchemaParams = {
  //   governanceBalance,
  //   transactionFee,
  //   minAmount: assetAmount.min,
  //   maxAmount: assetAmount.max,
  //   availableBalance: assetAmount.available
  // };

  const { content } = getData(t, variant);

  // const {
  //   register,
  //   handleSubmit: h,
  //   watch,
  //   formState: { errors, isDirty, isValid }
  // } = useForm<PoolFormData>({
  //   mode: 'onChange',
  //   resolver: zodResolver(schema)
  // });

  // const amount = watch(formField) || 0;
  // const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);

  // const isBtnDisabled = !isValidForm(errors) || !isDirty || !isValid;

  // const handleSubmit = (data: PoolFormData) => {
  //   try {
  //     console.log(data);
  //   } catch (err: any) {
  //     toast.error(err.toString());
  //   }
  // };

  return (
    // <form onSubmit={h(handleSubmit)}>
    <Flex direction='column' justifyContent='space-between' gap='spacing4'>
      <PoolName
        justifyContent='center'
        tickers={liquidityPool.pooledCurrencies.map((currency) => currency.currency.ticker)}
      />
      <Flex direction='column' gap='spacing4'>
        {liquidityPool.pooledCurrencies.map((currency) => (
          <TokenInput
            key={currency.currency.ticker}
            placeholder='0.00'
            ticker={currency.currency.ticker}
            aria-label={`${currency.currency.ticker} amount`}
            balance={getAvailableBalance(currency.currency.ticker)?.toBig().toNumber() || 0}
            balanceDecimals={currency.currency.humanDecimals}
            valueUSD={0}
          />
        ))}
      </Flex>
      <Flex direction='column' gap='spacing4'>
        <Card color='secondary'>
          <Dl direction='column' gap='spacing2'>
            <DlGroup justifyContent='space-between'>
              <Dt size='s' color='secondary'>
                Fees
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
          </Dl>
        </Card>

        <CTA type='submit' size='large'>
          {content.btn}
        </CTA>
      </Flex>
    </Flex>
    // </form>
  );
};

PoolForm.displayName = 'PoolForm';

export { PoolForm };
export type { PoolFormProps };
