import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Flex, Slider, TokenInput } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import {
  isFormDisabled,
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_DEPOSIT_FEE_TOKEN_FIELD,
  StrategyDepositFormData,
  strategyDepositSchema,
  useForm
} from '@/lib/form';

import { StrategyData } from '../../hooks/use-get-strategies';
import { useGetStrategyAvailableAmounts } from '../../hooks/use-get-strategy-available-amounts';
import { useGetStrategyLeverageData } from '../../hooks/use-get-strategy-leverage-data';
import { StrategyPositionData } from '../../hooks/use-get-strategy-position';
import { StrategyFormType, StrategyType } from '../../types';

type StrategyDepositFormProps = {
  strategy: StrategyData;
  // position?: StrategyPositionData;
};

const StrategyDepositForm = ({ strategy }: StrategyDepositFormProps): JSX.Element => {
  const { t } = useTranslation();
  const {} = useGetStrategyLeverageData(strategy);
  const prices = useGetPrices();

  const depositUSDValue =
    convertMonetaryAmountToValueInUSD(depositMonetaryAmount, prices?.[currencies.primary.ticker].usd) || 0;

  return (
    <TransactionDetails>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Available liquidity</TransactionDetailsDt>
        <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StrategyDepositForm };
