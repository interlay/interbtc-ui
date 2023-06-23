import { Trade } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';

import { CTAProps } from '@/component-library';
import { AuthCTA } from '@/components';
import { SWAP_INPUT_AMOUNT_FIELD, SWAP_INPUT_TOKEN_FIELD, SWAP_OUTPUT_TOKEN_FIELD, useForm } from '@/lib/form';
import { SwapPair } from '@/types/swap';
import { Transaction } from '@/utils/hooks/transaction';
import { UseFeeEstimateResult } from '@/utils/hooks/transaction/types/hook';
import { isTrasanctionFormDisabled } from '@/utils/hooks/transaction/utils/form';

const getProps = (
  pair: SwapPair,
  trade: Trade | null | undefined,
  form: ReturnType<typeof useForm>,
  fee: UseFeeEstimateResult<Transaction.AMM_SWAP>,
  t: TFunction
): Pick<CTAProps, 'children' | 'disabled'> => {
  const tickersError = (form.errors[SWAP_INPUT_TOKEN_FIELD] || form.errors[SWAP_OUTPUT_TOKEN_FIELD]) as string;

  if (tickersError) {
    return {
      disabled: true,
      children: t(tickersError)
    };
  }

  const inputError = form.errors[SWAP_INPUT_AMOUNT_FIELD] as string;

  if (inputError) {
    return {
      disabled: true,
      children: t(inputError, { token: pair.input?.ticker })
    };
  }

  if (trade === undefined) {
    return { children: 'Loading...', disabled: true };
  }

  if (trade === null) {
    return { children: t('amm.insufficient_liquidity_trade'), disabled: true };
  }

  return {
    children: t('amm.swap'),
    disabled: isTrasanctionFormDisabled(form, fee)
  };
};

type SwapCTAProps = {
  pair: SwapPair;
  trade: Trade | null | undefined;
  form: ReturnType<typeof useForm>;
  fee: UseFeeEstimateResult<Transaction.AMM_SWAP>;
};

const SwapCTA = ({ pair, trade, form, fee }: SwapCTAProps): JSX.Element | null => {
  const { t } = useTranslation();

  const otherProps = getProps(pair, trade, form, fee, t);

  return <AuthCTA type='submit' fullWidth size='large' {...otherProps} />;
};

export { SwapCTA };
export type { SwapCTAProps };
