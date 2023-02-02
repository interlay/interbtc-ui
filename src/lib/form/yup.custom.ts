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

yup.addMethod<yup.NumberSchema>(yup.number, 'requiredAmount', function () {
  return this.transform((value) => (value === '' ? undefined : Number(value))).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const { t } = ctx.options.context as YupContext;

      const message = t('forms.please_enter_the_amount_to', { field: ctx.path });
      return ctx.createError({ message });
    }

    return true;
  });
});

type FeesValidationParams = {
  transactionFee: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
};

// TODO: remove when fees are moved out of form validation
yup.addMethod<yup.NumberSchema>(
  yup.number,
  'fees',
  function ({ transactionFee, governanceBalance }: FeesValidationParams) {
    return this.test('fees', (_, ctx) => {
      const { t } = ctx.options.context as YupContext;

      if (governanceBalance.lt(transactionFee)) {
        const message = t('insufficient_funds_governance_token', {
          governanceTokenSymbol: transactionFee.currency.ticker
        });
        return ctx.createError({ message });
      }

      return true;
    });
  }
);

type BalanceValidationParams = {
  availableBalance: MonetaryAmount<CurrencyExt>;
};

yup.addMethod<yup.NumberSchema>(yup.number, 'balance', function ({ availableBalance }: BalanceValidationParams) {
  return this.test('balance', (value, ctx) => {
    const { t } = ctx.options.context as YupContext;

    if (value === undefined) return true;

    const amount = new Big(value);

    if (amount.gt(availableBalance.toBig())) {
      const message = t('forms.please_enter_no_higher_available_balance');
      return ctx.createError({ message });
    }

    return true;
  });
});

type MinBalanceValidationParams = {
  minAmount: MonetaryAmount<CurrencyExt>;
};

yup.addMethod<yup.NumberSchema>(yup.number, 'minAmount', function ({ minAmount }: MinBalanceValidationParams) {
  return this.test('balance', (value, ctx) => {
    const { t } = ctx.options.context as YupContext;

    if (value === undefined) return true;

    const amount = new Big(value);

    if (amount.lt(minAmount.toBig())) {
      const message = t('forms.amount_must_be_at_least', {
        action: ctx.path,
        amount: minAmount.toString(),
        token: minAmount.currency.ticker
      });
      return ctx.createError({ message });
    }

    return true;
  });
});

declare module 'yup' {
  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    requiredAmount(): NumberSchema<TType, TContext>;
    fees(params: FeesValidationParams): NumberSchema<TType, TContext>;
    balance(params: BalanceValidationParams): NumberSchema<TType, TContext>;
    minAmount(params: MinBalanceValidationParams): NumberSchema<TType, TContext>;
  }
}

export default yup;
export type { BalanceValidationParams, FeesValidationParams, MinBalanceValidationParams, YupContext };
