/* eslint-disable no-invalid-this */
import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'react-i18next';
import * as Yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

Yup.addMethod<Yup.NumberSchema>(Yup.number, 'requiredAmount', function () {
  return this.transform((value) => (value === '' ? undefined : Number(value))).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const { t } = ctx.options.context as { t: TFunction };

      const message = t('forms.please_enter_the_amount_to', { field: ctx.path });
      return ctx.createError({ message });
    }

    return true;
  });
});

// TODO: remove when fees are moved out of form validation
Yup.addMethod<Yup.NumberSchema>(Yup.number, 'fees', function () {
  return this.test('fees', (_, ctx) => {
    const { t, params } = ctx.options.context as {
      t: TFunction;
      params: { availableBalance?: MonetaryAmount<CurrencyExt>; transactionFee?: MonetaryAmount<CurrencyExt> };
    };

    // MEMO: this errors helps development
    if (!params.transactionFee || !params.availableBalance) {
      return ctx.createError({ message: 'Something went wrong! Please comeback later.' });
    }

    if (params.availableBalance.lt(params.transactionFee)) {
      const message = t('insufficient_funds_governance_token', {
        governanceTokenSymbol: params.transactionFee.currency.ticker
      });
      return ctx.createError({ message });
    }

    return true;
  });
});

Yup.addMethod<Yup.NumberSchema>(Yup.number, 'balance', function () {
  return this.test('balance', (value, ctx) => {
    const { t, params } = ctx.options.context as {
      t: TFunction;
      params: { availableBalance?: MonetaryAmount<CurrencyExt> };
    };

    if (value === undefined) return true;

    const amount = new Big(value);

    // MEMO: this errors helps development
    if (!params.availableBalance) {
      return ctx.createError({ message: 'Something went wrong! Please comeback later.' });
    }

    if (amount.gt(params.availableBalance.toBig())) {
      const message = t('forms.please_enter_no_higher_available_balance');
      return ctx.createError({ message });
    }

    return true;
  });
});

Yup.addMethod<Yup.NumberSchema>(Yup.number, 'minBalance', function () {
  return this.test('balance', (value, ctx) => {
    const { t, params } = ctx.options.context as {
      t: TFunction;
      params: { minAmount?: MonetaryAmount<CurrencyExt> };
    };

    if (value === undefined) return true;

    const amount = new Big(value);

    // MEMO: this errors helps development
    if (!params.minAmount) {
      return ctx.createError({ message: 'Something went wrong! Please comeback later.' });
    }

    if (amount.lt(params.minAmount.toBig())) {
      const message = t('forms.amount_must_be_at_least', {
        action: ctx.path,
        amount: params.minAmount.toString(),
        token: params.minAmount.currency.ticker
      });
      return ctx.createError({ message });
    }

    return true;
  });
});

declare module 'Yup' {
  interface NumberSchema<
    TType extends Maybe<number> = number | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    requiredAmount(): NumberSchema<TType, TContext>;
    fees(): NumberSchema<TType, TContext>;
    balance(): NumberSchema<TType, TContext>;
    minBalance(): NumberSchema<TType, TContext>;
  }
}

export default Yup;
