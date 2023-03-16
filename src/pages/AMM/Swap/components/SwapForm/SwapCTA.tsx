import { Trade } from '@interlay/interbtc-api';
import { TFunction, useTranslation } from 'react-i18next';

import { CTAProps } from '@/component-library';
import { AuthCTA } from '@/components';
import {
  FormErrors,
  SWAP_INPUT_AMOUNT_FIELD,
  SWAP_INPUT_TOKEN_FIELD,
  SWAP_OUTPUT_TOKEN_FIELD,
  SwapFormData
} from '@/lib/form';
import { SwapPair } from '@/types/swap';

const getProps = (
  pair: SwapPair,
  trade: Trade | null | undefined,
  errors: FormErrors<SwapFormData>,
  t: TFunction
): Pick<CTAProps, 'children' | 'disabled'> => {
  const tickersError = errors[SWAP_INPUT_TOKEN_FIELD] || errors[SWAP_OUTPUT_TOKEN_FIELD];

  if (tickersError) {
    return {
      disabled: true,
      children: t(tickersError)
    };
  }

  const inputError = errors[SWAP_INPUT_AMOUNT_FIELD];

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
    disabled: false
  };
};

type SwapCTAProps = {
  pair: SwapPair;
  trade: Trade | null | undefined;
  errors: FormErrors<SwapFormData>;
  loading: boolean;
};

const SwapCTA = ({ pair, trade, errors, loading }: SwapCTAProps): JSX.Element | null => {
  const { t } = useTranslation();

  const otherProps = getProps(pair, trade, errors, t);

  return <AuthCTA type='submit' fullWidth size='large' loading={loading} {...otherProps} />;
};

export { SwapCTA };
export type { SwapCTAProps };
