import { newMonetaryAmount } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
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
import { useGetStakingEstimationData } from '@/hooks/api/escrow/use-get-staking-estimation-data';
import { NetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
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
import { convertBlockNumbersToWeeks, convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { StakingLockTimeInput } from './StakingLockTimeInput';
import { StakingTransactionDetails } from './StakingTransactionDetails';

type Props = {
  accountData: AccountStakingData | null;
  networkData: NetworkStakingData;
  onStaking: () => void;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StakingFormProps = Props & InheritAttrs;

const StakingForm = ({ accountData, networkData, onStaking, ...props }: StakingFormProps): JSX.Element | null => {
  const prices = useGetPrices();
  const { t } = useTranslation();
  const { data: balances, getAvailableBalance } = useGetBalances();

  const { data: estimation, mutate: mutateEstimation } = useGetStakingEstimationData();

  const transaction = useTransaction({
    onSuccess: () => {
      form.resetForm();
      onStaking();
    }
  });

  const inputBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);

  const minAmount = newMonetaryAmount(1, GOVERNANCE_TOKEN);

  const inputSchemaParams = {
    maxAmount: inputBalance,
    minAmount
  };

  const getTransactionArgs = useCallback(
    async (values: StakingFormData) => {
      const amount = newMonetaryAmount(values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);
      const lockTime = values[STAKING_LOCK_TIME_AMOUNT_FIELD];

      const hasAmount = !amount.isZero();
      const hasLockTime = lockTime && lockTime > 0;

      if (accountData) {
        const newLockBlockNumber = lockTime ? convertWeeksToBlockNumbers(lockTime) : 0;

        const unlockHeight = accountData.endBlock + newLockBlockNumber;

        if (hasAmount && lockTime && lockTime > 0) {
          return { transactionType: Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT as const, amount, unlockHeight };
        } else if (hasAmount && !hasLockTime) {
          // transactionType = Transaction.ESCROW_INCREASE_LOCKED_AMOUNT;
          return { transactionType: Transaction.ESCROW_INCREASE_LOCKED_AMOUNT as const, amount };
        } else {
          return { transactionType: Transaction.ESCROW_INCREASE_LOCKED_TIME as const, unlockHeight };
        }
      } else {
        const currentBlockNumber = await window.bridge.system.getCurrentBlockNumber();

        const unlockHeight = currentBlockNumber + (lockTime || 0);

        return { transactionType: Transaction.ESCROW_CREATE_LOCK as const, amount, unlockHeight };
      }
    },
    [accountData]
  );

  const handleSubmit = async (values: StakingFormData) => {
    const data = await getTransactionArgs(values);

    if (!data) return;

    switch (data.transactionType) {
      case Transaction.ESCROW_CREATE_LOCK:
        return transaction.execute(data.transactionType, data.amount, data.unlockHeight);
      case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
        return transaction.execute(data.transactionType, data.amount);
      case Transaction.ESCROW_INCREASE_LOCKED_TIME:
        return transaction.execute(data.transactionType, data.unlockHeight);
      case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT:
        return transaction.execute(data.transactionType, data.amount, data.unlockHeight);
    }
  };

  const maxLockTime = useMemo(() => {
    if (!accountData) {
      return STAKE_LOCK_TIME.MAX;
    }

    const remainingWeeks = convertBlockNumbersToWeeks(accountData.unlock.block);

    return Math.floor(STAKE_LOCK_TIME.MAX - remainingWeeks);
  }, [accountData]);

  const form = useForm<StakingFormData>({
    initialValues: {
      [STAKING_AMOUNT_FIELD]: '',
      [STAKING_LOCK_TIME_AMOUNT_FIELD]: 1,
      [STAKING_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: stakingSchema({
      [STAKING_AMOUNT_FIELD]: inputSchemaParams,
      [STAKING_LOCK_TIME_AMOUNT_FIELD]: { min: STAKE_LOCK_TIME.MIN, max: maxLockTime }
    }),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      const data = await getTransactionArgs(values);

      if (!data) return;

      switch (data.transactionType) {
        case Transaction.ESCROW_CREATE_LOCK:
          return transaction.fee.estimate(data.transactionType, data.amount, data.unlockHeight);
        case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
          return transaction.fee.estimate(data.transactionType, data.amount);
        case Transaction.ESCROW_INCREASE_LOCKED_TIME:
          return transaction.fee.estimate(data.transactionType, data.unlockHeight);
        case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT:
          return transaction.fee.estimate(data.transactionType, data.amount, data.unlockHeight);
      }
    }
  });

  // MEMO: re-validate form on balances refetch
  useEffect(() => {
    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleListSelectionChange = (value: number) => {
    form.setFieldValue(STAKING_LOCK_TIME_AMOUNT_FIELD, value, true);

    const monetaryAmount = newSafeMonetaryAmount(form.values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);

    mutateEstimation({ amount: monetaryAmount, lockTime: value });
  };

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;

    if (!amount) return;

    const monetaryAmount = newSafeMonetaryAmount(amount, GOVERNANCE_TOKEN, true);

    mutateEstimation({ amount: monetaryAmount, lockTime: form.values[STAKING_LOCK_TIME_AMOUNT_FIELD] });
  };

  const handleChangeLockTime = (e: ChangeEvent<HTMLInputElement>) => {
    const lockTime = e.target.value;

    if (!lockTime) return;

    const monetaryAmount = newSafeMonetaryAmount(form.values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);

    mutateEstimation({ amount: monetaryAmount, lockTime: Number(lockTime) });
  };

  const monetaryAmount = newSafeMonetaryAmount(form.values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  console.log(form.errors);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  // TODO: lock form when user needs to withdraw staked INTR
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
              {...mergeProps(form.getFieldProps(STAKING_AMOUNT_FIELD, false, true), getTokenInputProps(inputBalance), {
                onChange: handleChangeAmount
              })}
            />
            <StakingLockTimeInput
              maxLockTime={maxLockTime}
              inputProps={mergeProps(form.getFieldProps(STAKING_LOCK_TIME_AMOUNT_FIELD, false, true), {
                onChange: handleChangeLockTime
              })}
              onListSelectionChange={handleListSelectionChange}
            />
            <Flex direction='column' gap='spacing2'>
              <StakingTransactionDetails
                accountData={accountData}
                estimation={estimation}
                amount={monetaryAmount}
                lockTime={form.values[STAKING_LOCK_TIME_AMOUNT_FIELD]}
              />
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
