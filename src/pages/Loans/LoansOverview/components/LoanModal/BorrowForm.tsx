import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowPosition, LoanAsset, newMonetaryAmount } from '@interlay/interbtc-api';
import { useId } from '@react-aria/utils';
import Big from 'big.js';
import { useForm } from 'react-hook-form';
import { TFunction, useTranslation } from 'react-i18next';
import * as z from 'zod';

import { displayMonetaryAmountInUSDFormat, formatNumber, formatUSD } from '@/common/utils/utils';
import { CTA, H3, P, Stack, TokenInput } from '@/component-library';
import validate, { LoanBorrowSchemaParams, LoanRepaySchemaParams } from '@/lib/form-validation';
import { BorrowAction } from '@/types/loans';
import { getErrorMessage, isValidForm } from '@/utils/helpers/forms';
import { useGetAccountLoansOverview } from '@/utils/hooks/api/loans/use-get-account-loans-overview';

import { useLoanFormData } from '../../utils/use-loan-form-data';
import { StyledDItem, StyledDl } from './LoanModal.style';
import { LoanScore } from './LoanScore';

const BORROW_AMOUNT = 'borrow-amount';
const REPAY_AMOUNT = 'repay-amount';

const getContentMap = (t: TFunction) => ({
  borrow: {
    title: t('loans.borrow'),
    label: 'Available',
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.borrow').toLowerCase() })
  },
  repay: {
    title: t('loans.repay'),
    label: 'Borrowed',
    fieldAriaLabel: t('forms.field_amount', { field: t('loans.repay').toLowerCase() })
  }
});

type BorrowSchemaParams = LoanBorrowSchemaParams & LoanRepaySchemaParams;

const getSchema = (t: TFunction, variant: BorrowAction, params: BorrowSchemaParams) => {
  if (variant === 'borrow') {
    return z.object({
      [BORROW_AMOUNT]: validate.loans.borrow(t, params)
    });
  }

  return z.object({
    [REPAY_AMOUNT]: validate.loans.repay(t, params)
  });
};

type BorrowFormData = { [BORROW_AMOUNT]: string; [REPAY_AMOUNT]: string };

type BorrowFormProps = {
  asset: LoanAsset;
  variant: BorrowAction;
  position: BorrowPosition | undefined;
};

const BorrowForm = ({ asset, variant, position }: BorrowFormProps): JSX.Element => {
  const titleId = useId();
  const { t } = useTranslation();
  const content = getContentMap(t)[variant];
  const {
    data: { borrowLimitUSDValue },
    refetch,
    getNewBorrowLimitUSDValue,
    getNewCollateralRatio
  } = useGetAccountLoansOverview();

  const { governanceBalance, assetAmount, assetPrice, transactionFee } = useLoanFormData(variant, asset, position);

  const schemaParams: BorrowSchemaParams = {
    governanceBalance,
    transactionFee,
    minAmount: assetAmount.min,
    maxAmount: assetAmount.max,
    availableBalance: assetAmount.available
  };

  const schema = getSchema(t, variant, schemaParams);

  const {
    register,
    handleSubmit: h,
    watch,
    formState: { errors, isDirty }
  } = useForm<BorrowFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema)
  });

  const amountFieldName = variant === 'borrow' ? BORROW_AMOUNT : REPAY_AMOUNT;
  const amount = watch(amountFieldName) || 0;
  const monetaryAmount = newMonetaryAmount(amount, asset.currency, true);
  const newBorrowLimit = getNewBorrowLimitUSDValue(variant, asset.currency, monetaryAmount) || Big(0);
  const collateralRatio = getNewCollateralRatio(variant, asset.currency, monetaryAmount);

  const isBtnDisabled = !isValidForm(errors) || !isDirty;

  const handleSubmit = (data: BorrowFormData) => {
    try {
      console.log(data);
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={h(handleSubmit)}>
      <Stack spacing='double'>
        <div>
          <H3 id={titleId}>
            {content.title} {asset.currency.name}
          </H3>
          <P>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</P>
        </div>
        <Stack>
          <TokenInput
            placeholder='0.00'
            tokenSymbol={asset.currency.ticker}
            errorMessage={getErrorMessage(errors[amountFieldName])}
            label={content.label}
            aria-label={content.fieldAriaLabel}
            balance={assetAmount.max.toBig().toNumber()}
            balanceInUSD={displayMonetaryAmountInUSDFormat(assetAmount.max, assetPrice)}
            valueInUSD={displayMonetaryAmountInUSDFormat(monetaryAmount, assetPrice)}
            // TODO: we need a more generic way to know how many digits to show
            renderBalance={(value) =>
              formatNumber(value, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 5
              })
            }
            {...register(amountFieldName)}
          />
          <LoanScore score={collateralRatio} />
          <StyledDl>
            <StyledDItem>
              <dt>APY</dt>
              <dd>{formatNumber(asset.borrowApy.toNumber())}%</dd>
            </StyledDItem>
            {variant === 'borrow' && asset.borrowReward && (
              <StyledDItem>
                <dt>Borrow Limit</dt>
                <dd>
                  {formatUSD(borrowLimitUSDValue?.toNumber() || 0)} -&gt; {formatUSD(newBorrowLimit.toNumber())}
                </dd>
              </StyledDItem>
            )}
            <StyledDItem>
              <dt>Borrow Limit</dt>
              <dd>
                {formatUSD(borrowLimitUSDValue?.toNumber() || 0)} -&gt; {formatUSD(newBorrowLimit.toNumber())}
              </dd>
            </StyledDItem>
          </StyledDl>
          <CTA type='submit' disabled={isBtnDisabled} size='large'>
            {content.title}
          </CTA>
        </Stack>
      </Stack>
    </form>
  );
};

export { BorrowForm };
export type { BorrowFormProps };
