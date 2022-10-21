import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import { displayMonetaryAmount } from '@/common/utils/utils';

import balance from '../common/balance';
import field from '../common/field';

type ValidateDepositParams = {
  minCollateralAmount: MonetaryAmount<CurrencyExt>;
  collateralBalance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
};

const deposit = (t: TFunction, params: ValidateDepositParams): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    const { collateralBalance, governanceBalance, minCollateralAmount, transactionFee } = params;

    if (field.required.validate({ value })) {
      return ctx.addIssue({ ...field.required.issue(), message: t('vault.please_enter_deposit_amount') });
    }

    if (balance.transactionFee.validate({ availableBalance: governanceBalance, transactionFee })) {
      return ctx.addIssue(balance.transactionFee.issue(t));
    }

    const inputAmount = newMonetaryAmount(value, collateralBalance.currency, true);

    if (balance.currency.validate({ availableBalance: collateralBalance, inputAmount })) {
      return ctx.addIssue(balance.currency.issue(t));
    }

    if (inputAmount.lt(minCollateralAmount)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('vault.minimum_required_collateral', {
          currentCollateral: displayMonetaryAmount(inputAmount),
          collateralTokenSymbol: inputAmount.currency.ticker
        })
      });
    }
  });

export { deposit };
export type { ValidateDepositParams };
