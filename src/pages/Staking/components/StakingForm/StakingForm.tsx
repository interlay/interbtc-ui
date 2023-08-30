import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, newSafeMonetaryAmount } from '@/common/utils/utils';
import { Alert, Card, CardProps, Divider, Flex, H1, TokenInput } from '@/component-library';
import { AuthCTA, TransactionFeeDetails } from '@/components';
import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { useGetStakingDetailsData } from '@/hooks/api/escrow/use-get-staking-details-data';
import { NetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
import {
  STAKING_AMOUNT_FIELD,
  STAKING_FEE_TOKEN_FIELD,
  STAKING_LOCKED_WEEKS_AMOUNT_FIELD,
  StakingFormData,
  stakingSchema,
  useForm
} from '@/lib/form';
import { getTokenInputProps } from '@/utils/helpers/input';
import { getTokenPrice } from '@/utils/helpers/prices';
import { convertBlockNumbersToWeeks, convertWeeksToBlockNumbers } from '@/utils/helpers/staking';

import { StakingLockTimeInput } from './StakingLockTimeInput';
import { StakingNetworkDetails } from './StakingNetworkDetails';
import { StakingTransactionDetails } from './StakingTransactionDetails';

const MIN_AMOUNT = newMonetaryAmount(1, GOVERNANCE_TOKEN);

type Props = {
  accountData: AccountStakingData | null;
  networkData: NetworkStakingData;
  onStaking: () => void;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StakingFormProps = Props & InheritAttrs;

const StakingForm = ({ accountData, networkData, onStaking, ...props }: StakingFormProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();
  const { data: balances, getAvailableBalance } = useGetBalances();

  const { data: detailsData, mutate: mutateDetails } = useGetStakingDetailsData();

  const transaction = useTransaction({
    onSuccess: () => {
      form.resetForm();
      onStaking();
    }
  });

  const hasStake = !!accountData;

  const governanceBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);
  const inputBalance = governanceBalance;
  //   accountData?.limit && governanceBalance && pickSmallerAmount(governanceBalance, accountData.limit);

  const getTransactionArgs = useCallback(
    async (values: StakingFormData) => {
      const amount = newMonetaryAmount(values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);
      const weeksLocked = Number(values[STAKING_LOCKED_WEEKS_AMOUNT_FIELD]);

      const hasAmount = !amount.isZero();

      if (accountData) {
        const blockNumber = weeksLocked ? convertWeeksToBlockNumbers(weeksLocked) : 0;

        const unlockHeight = accountData.unlock.block + blockNumber;

        if (hasAmount && weeksLocked) {
          return { transactionType: Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT as const, amount, unlockHeight };
        } else if (hasAmount && !weeksLocked) {
          return { transactionType: Transaction.ESCROW_INCREASE_LOCKED_AMOUNT as const, amount };
        } else {
          return { transactionType: Transaction.ESCROW_INCREASE_LOCKED_TIME as const, unlockHeight };
        }
      } else {
        const currentBlockNumber = await window.bridge.system.getCurrentBlockNumber();
        const unlockHeight = currentBlockNumber + convertWeeksToBlockNumbers(weeksLocked);

        return { transactionType: Transaction.ESCROW_CREATE_LOCK as const, amount, unlockHeight };
      }
    },
    [accountData]
  );

  const handleSubmit = async (values: StakingFormData) => {
    const data = await getTransactionArgs(values);

    if (!data) return;

    let monetaryAmount = data.amount;

    if (monetaryAmount && transaction.fee.isEqualFeeCurrency(monetaryAmount.currency)) {
      monetaryAmount = transaction.calculateAmountWithFeeDeducted(monetaryAmount);
    }

    switch (data.transactionType) {
      case Transaction.ESCROW_CREATE_LOCK:
        return transaction.execute(
          data.transactionType,
          monetaryAmount as MonetaryAmount<CurrencyExt>,
          data.unlockHeight
        );
      case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT:
        return transaction.execute(
          data.transactionType,
          monetaryAmount as MonetaryAmount<CurrencyExt>,
          data.unlockHeight
        );
      case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
        return transaction.execute(data.transactionType, monetaryAmount as MonetaryAmount<CurrencyExt>);
      case Transaction.ESCROW_INCREASE_LOCKED_TIME:
        return transaction.execute(data.transactionType, data.unlockHeight);
    }
  };

  const lockedWeeksLimit = useMemo(() => {
    if (!accountData) {
      return { min: STAKE_LOCK_TIME.MIN, max: STAKE_LOCK_TIME.MAX };
    }

    const remainingWeeks = convertBlockNumbersToWeeks(accountData.unlock.remainingBlocks);

    return { min: 0, max: Math.floor(STAKE_LOCK_TIME.MAX - remainingWeeks) };
  }, [accountData]);

  const form = useForm<StakingFormData>({
    initialValues: {
      [STAKING_AMOUNT_FIELD]: '',
      [STAKING_LOCKED_WEEKS_AMOUNT_FIELD]: '',
      [STAKING_FEE_TOKEN_FIELD]: transaction.fee.defaultCurrency.ticker
    },
    validationSchema: stakingSchema(
      {
        [STAKING_AMOUNT_FIELD]: {
          maxAmount: inputBalance,
          minAmount: MIN_AMOUNT
        },
        [STAKING_LOCKED_WEEKS_AMOUNT_FIELD]: lockedWeeksLimit
      },
      hasStake
    ),
    onSubmit: handleSubmit,
    onComplete: async (values) => {
      if (accountData?.unlock.isAvailable) return;

      const data = await getTransactionArgs(values);

      if (!data) return;

      switch (data.transactionType) {
        case Transaction.ESCROW_CREATE_LOCK:
          return transaction.fee.estimate(data.transactionType, data.amount, data.unlockHeight);
        case Transaction.ESCROW_INCREASE_LOOKED_TIME_AND_AMOUNT:
          return transaction.fee.estimate(data.transactionType, data.amount, data.unlockHeight);
        case Transaction.ESCROW_INCREASE_LOCKED_AMOUNT:
          return transaction.fee.estimate(data.transactionType, data.amount);
        case Transaction.ESCROW_INCREASE_LOCKED_TIME:
          return transaction.fee.estimate(data.transactionType, data.unlockHeight);
      }
    }
  });

  useEffect(() => {
    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, accountData]);

  useEffect(() => {
    handleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData]);

  const handleDetails = (amountProp?: string, weeksLockedProp?: number) => {
    if (accountData?.unlock.isAvailable) return;

    const amount = amountProp || form.values[STAKING_AMOUNT_FIELD] || 0;

    const monetaryAmount = newSafeMonetaryAmount(amount, GOVERNANCE_TOKEN, true);

    const weeksLocked =
      weeksLockedProp === undefined ? Number(form.values[STAKING_LOCKED_WEEKS_AMOUNT_FIELD]) : weeksLockedProp;

    mutateDetails({ amount: monetaryAmount, weeksLocked });
  };

  const handleListSelectionChange = (value: number) => {
    form.setFieldValue(STAKING_LOCKED_WEEKS_AMOUNT_FIELD, value, true);

    handleDetails(undefined, value);
  };

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;

    handleDetails(amount);
  };

  const handleChangeLockTime = (e: ChangeEvent<HTMLInputElement>) => {
    const weeksLocked = e.target.value;

    handleDetails(undefined, weeksLocked ? Number(weeksLocked) : 0);
  };

  const monetaryAmount = newSafeMonetaryAmount(form.values[STAKING_AMOUNT_FIELD] || 0, GOVERNANCE_TOKEN, true);
  const amountUSD = monetaryAmount
    ? convertMonetaryAmountToValueInUSD(monetaryAmount, getTokenPrice(prices, monetaryAmount.currency.ticker)?.usd) || 0
    : 0;

  const isBtnDisabled = accountData?.unlock.isAvailable || isTransactionFormDisabled(form, transaction.fee);

  const shouldDisplayWithdrawAlert = accountData?.unlock.isAvailable && form.dirty;

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Stake {GOVERNANCE_TOKEN.ticker}
      </H1>
      <Divider size='medium' orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <StakingNetworkDetails data={networkData} />
            <TokenInput
              label={t('amount')}
              placeholder='0.00'
              valueUSD={amountUSD}
              ticker={GOVERNANCE_TOKEN.ticker}
              {...mergeProps(form.getFieldProps(STAKING_AMOUNT_FIELD, false, true), getTokenInputProps(inputBalance), {
                onChange: handleChangeAmount
              })}
            />
            <StakingLockTimeInput
              min={lockedWeeksLimit.min}
              max={lockedWeeksLimit.max}
              isExtending={hasStake}
              inputProps={mergeProps(form.getFieldProps(STAKING_LOCKED_WEEKS_AMOUNT_FIELD, false, true), {
                onChange: handleChangeLockTime
              })}
              onListSelectionChange={handleListSelectionChange}
            />
            {shouldDisplayWithdrawAlert && (
              <Alert status='warning'>
                Your already staked {GOVERNANCE_TOKEN.ticker} needs to be withdrawn before adding a new stake
              </Alert>
            )}
            <Flex direction='column' gap='spacing2'>
              <StakingTransactionDetails hasStake={hasStake} data={detailsData} />
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
