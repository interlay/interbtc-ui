import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Card, CardProps, Divider, Flex, H1, TokenInput } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { NetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { useTransaction } from '@/hooks/transaction';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
import {
  STAKING_AMOUNT_FIELD,
  STAKING_FEE_TOKEN_FIELD,
  STAKING_LOCK_TIME_AMOUNT_FIELD,
  StakingFormData,
  stakingSchema,
  useForm
} from '@/lib/form';
import { getTokenInputProps } from '@/utils/helpers/input';
import { getTokenPrice } from '@/utils/helpers/prices';
import { convertBlockNumbersToWeeks } from '@/utils/helpers/staking';

import { StakingLockTimeInput } from './StakingLockTimeInput';
import { StakingTransactionDetails } from './StakingTransactionDetails';

type Props = {
  accountData: AccountStakingData;
  votingBalance: MonetaryAmount<CurrencyExt>;
  networkData: NetworkStakingData;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StakingFormProps = Props & InheritAttrs;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StakingForm = ({ accountData, votingBalance, networkData, ...props }: StakingFormProps): JSX.Element | null => {
  const prices = useGetPrices();
  const { t } = useTranslation();
  const { data: balances, getAvailableBalance } = useGetBalances();

  const transaction = useTransaction({
    onSuccess: () => {
      form.resetForm();
    }
  });

  const inputBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);

  const minAmount = newMonetaryAmount(1, GOVERNANCE_TOKEN);

  const inputSchemaParams = {
    maxAmount: inputBalance,
    minAmount
  };

  const getTransactionArgs = useCallback(async (values: StakingFormData) => {
    const amount = newMonetaryAmount(values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);

    return { amount, lockTime: values[STAKING_LOCK_TIME_AMOUNT_FIELD] };
  }, []);

  const handleSubmit = async (values: StakingFormData) => {
    const transactionData = await getTransactionArgs(values);

    if (!transactionData || !transaction.fee.data || !inputBalance) return;

    // const {amount,lockTime} = transactionData

    // const isStaking = !votingBalance.isZero()

    // if(!isStaking) {
    //   const unlockHeight = currentBlockNumber + convertWeeksToBlockNumbers(numberTime);

    //  return transaction.execute(monetaryAmount, unlockHeight);

    // }

    // const { accountId, deadline, minimumAmountOut, trade: tradeData } = transactionData;

    // transaction.execute(tradeData, minimumAmountOut, accountId, deadline);
  };

  const maxLockTime = useMemo(() => {
    const remainingWeeks = convertBlockNumbersToWeeks(accountData.unlock.block);

    return Math.floor(STAKE_LOCK_TIME.MAX - remainingWeeks);
  }, [accountData.unlock.block]);

  const form = useForm<StakingFormData>({
    initialValues: {
      [STAKING_AMOUNT_FIELD]: '',
      [STAKING_LOCK_TIME_AMOUNT_FIELD]: STAKE_LOCK_TIME.MIN,
      [STAKING_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: stakingSchema({
      [STAKING_AMOUNT_FIELD]: inputSchemaParams,
      [STAKING_LOCK_TIME_AMOUNT_FIELD]: { min: STAKE_LOCK_TIME.MIN, max: maxLockTime }
    }),
    onSubmit: handleSubmit,
    validateOnMount: true
  });

  // MEMO: re-validate form on balances refetch
  useEffect(() => {
    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleListSelectionChange = (value: number) => {
    form.setFieldValue(STAKING_LOCK_TIME_AMOUNT_FIELD, value, true);
  };

  const monetaryAmount = newSafeMonetaryAmount(form.values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Stake {GOVERNANCE_TOKEN.ticker}
      </H1>
      <Divider size='medium' orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <TransactionDetails>
              <TransactionDetailsGroup>
                <TransactionDetailsDt>Total Staked {GOVERNANCE_TOKEN.ticker} in the network</TransactionDetailsDt>
                <TransactionDetailsDd>
                  {networkData.totalStakedBalance.toHuman()} {GOVERNANCE_TOKEN.ticker}
                </TransactionDetailsDd>
              </TransactionDetailsGroup>
              <TransactionDetailsGroup>
                <TransactionDetailsDt>Total {VOTE_GOVERNANCE_TOKEN.ticker} in the network</TransactionDetailsDt>
                <TransactionDetailsDd>
                  {networkData.totalVotingSupply.toHuman()} {VOTE_GOVERNANCE_TOKEN.ticker}
                </TransactionDetailsDd>
              </TransactionDetailsGroup>
            </TransactionDetails>
            <TokenInput
              placeholder='0.00'
              valueUSD={amountUSD}
              ticker={GOVERNANCE_TOKEN.ticker}
              {...mergeProps(form.getFieldProps(STAKING_AMOUNT_FIELD, false, true), getTokenInputProps(inputBalance))}
            />
            <StakingLockTimeInput
              maxLockTime={maxLockTime}
              inputProps={form.getFieldProps(STAKING_LOCK_TIME_AMOUNT_FIELD, false, true)}
              onListSelectionChange={handleListSelectionChange}
            />
            <Flex direction='column' gap='spacing2'>
              <StakingTransactionDetails />
              <TransactionFeeDetails
                fee={transaction.fee}
                selectProps={form.getSelectFieldProps(STAKING_FEE_TOKEN_FIELD)}
              />
            </Flex>
            <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={transaction.isLoading}>
              {t('stake')}
            </AuthCTA>
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { StakingForm };
export type { StakingFormProps };
