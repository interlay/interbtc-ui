import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { TFunction } from 'i18next';
import * as z from 'zod';

import { displayMonetaryAmount } from '@/common/utils/utils';
import { GOVERNANCE_TOKEN_SYMBOL } from '@/config/relay-chains';

const validateDepositCollateral = (t: TFunction) => ({
  minAmount,
  balance,
  governanceBalance,
  transactionFee
}: {
  minAmount: MonetaryAmount<CurrencyExt>;
  balance: MonetaryAmount<CurrencyExt>;
  governanceBalance: MonetaryAmount<CurrencyExt>;
  transactionFee: MonetaryAmount<CurrencyExt>;
}): z.ZodEffects<z.ZodString, string, string> =>
  z.string().superRefine((value, ctx) => {
    if (governanceBalance.lte(transactionFee)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('insufficient_funds_governance_token', {
          governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
        })
      });
    }

    if (!value) {
      return ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        message: t('vault.please_enter_deposit_amount'),
        inclusive: true,
        type: 'string'
      });
    }

    const inputAmount = new Big(value);

    if (!inputAmount.gte(minAmount.toBig())) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('vault.minimum_required_collateral', {
          currentCollateral: displayMonetaryAmount(minAmount),
          collateralTokenSymbol: minAmount.currency.ticker
        })
      });
    }

    if (!inputAmount.lte(balance.toBig())) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('amount_exceeds_the_available_amount')
      });
    }
  });

export { validateDepositCollateral };
