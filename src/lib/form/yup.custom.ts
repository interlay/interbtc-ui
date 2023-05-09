/* eslint-disable no-invalid-this */
import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'react-i18next';
import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

type YupContext = {
  t: TFunction;
};

yup.addMethod<yup.StringSchema>(yup.string, 'requiredAmount', function (action: string, customMessage?: string) {
  return this.transform((value) => (isNaN(value) ? undefined : value)).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const { t } = ctx.options.context as YupContext;

      const message = customMessage || t('forms.please_enter_the_amount_to', { field: action });
      return ctx.createError({ message });
    }

    return true;
  });
});

type FeesValidationParams = {
  transactionFee: MonetaryAmount<CurrencyExt> | undefined;
  governanceBalance?: MonetaryAmount<CurrencyExt>;
};

// TODO: remove when fees are moved out of form validation
yup.addMethod<yup.StringSchema>(
  yup.string,
  'fees',
  function ({ transactionFee, governanceBalance }: FeesValidationParams, customMessage?: string) {
    return this.test('fees', (_, ctx) => {
      const { t } = ctx.options.context as YupContext;

      if (transactionFee && governanceBalance?.lt(transactionFee)) {
        const message =
          customMessage ||
          t('insufficient_funds_governance_token', {
            governanceTokenSymbol: transactionFee.currency.ticker
          });

        return ctx.createError({ message });
      }

      return true;
    });
  }
);

type MaxAmountValidationParams = {
  maxAmount: MonetaryAmount<CurrencyExt> | Big | undefined;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'maxAmount',
  function ({ maxAmount }: MaxAmountValidationParams, action?: string, customMessage?: string) {
    return this.test('maxAmount', (value, ctx) => {
      const { t } = ctx.options.context as YupContext;

      if (value === undefined) return true;

      const amount = new Big(value);

      const isMonetaryAmount = (maxAmount as MonetaryAmount<CurrencyExt>).currency;

      // same validation, just different data types that lead to different implementation
      if (isMonetaryAmount && amount.gt((maxAmount as MonetaryAmount<CurrencyExt>).toBig())) {
        const message = customMessage || t('forms.please_enter_no_higher_available_balance');
        return ctx.createError({ message });
      }

      if (amount.gt(maxAmount as Big)) {
        const message = customMessage || t('forms.amount_must_be_at_most', { action, amount: maxAmount?.toString() });
        return ctx.createError({ message });
      }

      return true;
    });
  }
);

type MinAmountValidationParams = {
  minAmount: MonetaryAmount<CurrencyExt> | undefined;
};

yup.addMethod<yup.StringSchema>(
  yup.string,
  'minAmount',
  function ({ minAmount }: MinAmountValidationParams, action: string, customMessage?: string) {
    return this.test('balance', (value, ctx) => {
      const { t } = ctx.options.context as YupContext;

      if (value === undefined) return true;

      const amount = new Big(value);

      if (minAmount && amount.lt(minAmount?.toBig())) {
        const message =
          customMessage ||
          t('forms.amount_must_be_at_least', {
            action,
            amount: minAmount.toString(),
            token: minAmount.currency.ticker
          });
        return ctx.createError({ message });
      }

      return true;
    });
  }
);

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    requiredAmount(action?: string, customMessage?: string): StringSchema<TType, TContext>;
    fees(params: FeesValidationParams, customMessage?: string): StringSchema<TType, TContext>;
    maxAmount(
      params: MaxAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
    minAmount(
      params: MinAmountValidationParams,
      action?: string,
      customMessage?: string
    ): StringSchema<TType, TContext>;
  }
}

export default yup;
export type { FeesValidationParams, MaxAmountValidationParams, MinAmountValidationParams, YupContext };
