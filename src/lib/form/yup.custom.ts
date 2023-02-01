/* eslint-disable no-invalid-this */
import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'react-i18next';
import * as Yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

Yup.addMethod<Yup.NumberSchema>(Yup.number, 'requiredAmount', function () {
  return this.transform((value) => (value === '' ? undefined : Number(value))).test('requiredAmount', (value, ctx) => {
    if (value === undefined) {
      const { t } = ctx.options.context as { t: TFunction };

      console.log(ctx);

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

    if (params.transactionFee && params.availableBalance?.lt(params.transactionFee)) {
      const message = t('insufficient_funds_governance_token', {
        governanceTokenSymbol: params.transactionFee.currency.ticker
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
  }
}

export default Yup;
