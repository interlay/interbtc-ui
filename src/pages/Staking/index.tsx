import { DefaultTransactionAPI, newMonetaryAmount } from '@interlay/interbtc-api';
import { AddressOrPair } from '@polkadot/api/types';
import Big from 'big.js';
import clsx from 'clsx';
import { add, format } from 'date-fns';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import { showAccountModalAction } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import {
  displayMonetaryAmount,
  displayMonetaryAmountInUSDFormat,
  formatNumber,
  formatPercentage
} from '@/common/utils/utils';
import AvailableBalanceUI from '@/components/AvailableBalanceUI';
import ErrorFallback from '@/components/ErrorFallback';
import ErrorModal from '@/components/ErrorModal';
import Panel from '@/components/Panel';
import SubmitButton from '@/components/SubmitButton';
import TitleWithUnderline from '@/components/TitleWithUnderline';
import TokenField from '@/components/TokenField';
import InformationTooltip from '@/components/tooltips/InformationTooltip';
import WarningBanner from '@/components/WarningBanner';
import { BLOCK_TIME } from '@/config/parachain';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  GovernanceTokenMonetaryAmount,
  STAKE_LOCK_TIME,
  VOTE_GOVERNANCE_TOKEN,
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  VoteGovernanceTokenMonetaryAmount
} from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import {
  STAKING_TRANSACTION_FEE_RESERVE_FETCHER,
  stakingTransactionFeeReserveFetcher
} from '@/services/fetchers/staking-transaction-fee-reserve-fetcher';
import { useGovernanceTokenBalance } from '@/services/hooks/use-token-balance';
import { ZERO_GOVERNANCE_TOKEN_AMOUNT, ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT } from '@/utils/constants/currency';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';
import { KUSAMA } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import BalancesUI from './BalancesUI';
import ClaimRewardsButton from './ClaimRewardsButton';
import InformationUI from './InformationUI';
import LockTimeField from './LockTimeField';
import TotalsUI from './TotalsUI';
import WithdrawButton from './WithdrawButton';

const SHARED_CLASSES = clsx('mx-auto', 'md:max-w-2xl');

const ONE_WEEK_SECONDS = 7 * 24 * 3600;

const convertWeeksToBlockNumbers = (weeks: number) => {
  return (weeks * ONE_WEEK_SECONDS) / BLOCK_TIME;
};

const convertBlockNumbersToWeeks = (blockNumbers: number) => {
  return (blockNumbers * BLOCK_TIME) / ONE_WEEK_SECONDS;
};

// When to increase lock amount and extend lock time
const checkIncreaseLockAmountAndExtendLockTime = (lockTime: number, lockAmount: GovernanceTokenMonetaryAmount) => {
  return lockTime > 0 && lockAmount.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT);
};
// When to only increase lock amount
const checkOnlyIncreaseLockAmount = (lockTime: number, lockAmount: GovernanceTokenMonetaryAmount) => {
  return lockTime === 0 && lockAmount.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT);
};
// When to only extend lock time
const checkOnlyExtendLockTime = (lockTime: number, lockAmount: GovernanceTokenMonetaryAmount) => {
  return lockTime > 0 && lockAmount.eq(ZERO_GOVERNANCE_TOKEN_AMOUNT);
};

const LOCKING_AMOUNT = 'locking-amount';
const LOCK_TIME = 'lock-time';

type StakingFormData = {
  [LOCKING_AMOUNT]: string;
  [LOCK_TIME]: string;
};

interface EstimatedRewardAmountAndAPY {
  amount: GovernanceTokenMonetaryAmount;
  apy: Big;
}

interface StakedAmountAndEndBlock {
  amount: GovernanceTokenMonetaryAmount;
  endBlock: number;
}

interface LockingAmountAndTime {
  amount: GovernanceTokenMonetaryAmount;
  time: number; // Weeks
}

const Staking = (): JSX.Element => {
  const [blockLockTimeExtension, setBlockLockTimeExtension] = React.useState<number>(0);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const { bridgeLoaded, address } = useSelector((state: StoreType) => state.general);

  const {
    governanceTokenBalanceIdle,
    governanceTokenBalanceLoading,
    governanceTokenBalance
  } = useGovernanceTokenBalance();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    trigger,
    setValue
  } = useForm<StakingFormData>({
    mode: 'onChange', // 'onBlur'
    defaultValues: {
      [LOCKING_AMOUNT]: '0',
      [LOCK_TIME]: '0'
    }
  });
  const lockingAmount = watch(LOCKING_AMOUNT) || '0';
  const lockTime = watch(LOCK_TIME) || '0';

  const {
    isIdle: currentBlockNumberIdle,
    isLoading: currentBlockNumberLoading,
    data: currentBlockNumber,
    error: currentBlockNumberError
  } = useQuery<number, Error>([GENERIC_FETCHER, 'system', 'getCurrentBlockNumber'], genericFetcher<number>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(currentBlockNumberError);

  const {
    isIdle: voteGovernanceTokenBalanceIdle,
    isLoading: voteGovernanceTokenBalanceLoading,
    data: voteGovernanceTokenBalance,
    error: voteGovernanceTokenBalanceError,
    refetch: voteGovernanceTokenBalanceRefetch
  } = useQuery<VoteGovernanceTokenMonetaryAmount, Error>(
    [GENERIC_FETCHER, 'escrow', 'votingBalance', address],
    genericFetcher<VoteGovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(voteGovernanceTokenBalanceError);

  // My currently claimable rewards
  const {
    isIdle: claimableRewardAmountIdle,
    isLoading: claimableRewardAmountLoading,
    data: claimableRewardAmount,
    error: claimableRewardAmountError,
    refetch: claimableRewardAmountRefetch
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [GENERIC_FETCHER, 'escrow', 'getRewards', address],
    genericFetcher<GovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(claimableRewardAmountError);

  // Projected governance token rewards
  const {
    isIdle: projectedRewardAmountAndAPYIdle,
    isLoading: projectedRewardAmountAndAPYLoading,
    data: projectedRewardAmountAndAPY,
    error: rewardAmountAndAPYError,
    refetch: rewardAmountAndAPYRefetch
  } = useQuery<EstimatedRewardAmountAndAPY, Error>(
    [GENERIC_FETCHER, 'escrow', 'getRewardEstimate', address],
    genericFetcher<EstimatedRewardAmountAndAPY>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(rewardAmountAndAPYError);

  // Estimated governance token Rewards & APY
  const monetaryLockingAmount = newMonetaryAmount(lockingAmount, GOVERNANCE_TOKEN, true);
  const {
    isIdle: estimatedRewardAmountAndAPYIdle,
    isLoading: estimatedRewardAmountAndAPYLoading,
    data: estimatedRewardAmountAndAPY,
    error: estimatedRewardAmountAndAPYError
  } = useQuery<EstimatedRewardAmountAndAPY, Error>(
    [GENERIC_FETCHER, 'escrow', 'getRewardEstimate', address, monetaryLockingAmount, blockLockTimeExtension],
    genericFetcher<EstimatedRewardAmountAndAPY>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(estimatedRewardAmountAndAPYError);

  const {
    isIdle: stakedAmountAndEndBlockIdle,
    isLoading: stakedAmountAndEndBlockLoading,
    data: stakedAmountAndEndBlock,
    error: stakedAmountAndEndBlockError,
    refetch: stakedAmountAndEndBlockRefetch
  } = useQuery<StakedAmountAndEndBlock, Error>(
    [GENERIC_FETCHER, 'escrow', 'getStakedBalance', address],
    genericFetcher<StakedAmountAndEndBlock>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(stakedAmountAndEndBlockError);

  const {
    isIdle: transactionFeeReserveIdle,
    isLoading: transactionFeeReserveLoading,
    data: transactionFeeReserve,
    error: transactionFeeReserveError
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [STAKING_TRANSACTION_FEE_RESERVE_FETCHER, address],
    stakingTransactionFeeReserveFetcher(address),
    {
      enabled: bridgeLoaded && !!address
    }
  );
  useErrorHandler(transactionFeeReserveError);

  const initialStakeMutation = useMutation<void, Error, LockingAmountAndTime>(
    (variables: LockingAmountAndTime) => {
      if (currentBlockNumber === undefined) {
        throw new Error('Something went wrong!');
      }
      const unlockHeight = currentBlockNumber + convertWeeksToBlockNumbers(variables.time);

      return window.bridge.escrow.createLock(variables.amount, unlockHeight);
    },
    {
      onSuccess: () => {
        voteGovernanceTokenBalanceRefetch();
        stakedAmountAndEndBlockRefetch();
        claimableRewardAmountRefetch();
        rewardAmountAndAPYRefetch();
        reset({
          [LOCKING_AMOUNT]: '0.0',
          [LOCK_TIME]: '0'
        });
      }
    }
  );

  const moreStakeMutation = useMutation<void, Error, LockingAmountAndTime>(
    (variables: LockingAmountAndTime) => {
      return (async () => {
        if (stakedAmountAndEndBlock === undefined) {
          throw new Error('Something went wrong!');
        }

        if (checkIncreaseLockAmountAndExtendLockTime(variables.time, variables.amount)) {
          const unlockHeight = stakedAmountAndEndBlock.endBlock + convertWeeksToBlockNumbers(variables.time);

          const txs = [
            window.bridge.api.tx.escrow.increaseAmount(variables.amount.toString(true)),
            window.bridge.api.tx.escrow.increaseUnlockHeight(unlockHeight)
          ];
          const batch = window.bridge.api.tx.utility.batchAll(txs);
          await DefaultTransactionAPI.sendLogged(
            window.bridge.api,
            window.bridge.account as AddressOrPair,
            batch,
            undefined, // don't await success event
            true // don't wait for finalized blocks
          );
        } else if (checkOnlyIncreaseLockAmount(variables.time, variables.amount)) {
          return await window.bridge.escrow.increaseAmount(variables.amount);
        } else if (checkOnlyExtendLockTime(variables.time, variables.amount)) {
          const unlockHeight = stakedAmountAndEndBlock.endBlock + convertWeeksToBlockNumbers(variables.time);

          return await window.bridge.escrow.increaseUnlockHeight(unlockHeight);
        } else {
          throw new Error('Something went wrong!');
        }
      })();
    },
    {
      onSuccess: () => {
        voteGovernanceTokenBalanceRefetch();
        stakedAmountAndEndBlockRefetch();
        claimableRewardAmountRefetch();
        rewardAmountAndAPYRefetch();
        reset({
          [LOCKING_AMOUNT]: '0.0',
          [LOCK_TIME]: '0'
        });
      }
    }
  );

  React.useEffect(() => {
    if (!lockTime) return;

    const lockTimeValue = Number(lockTime);
    setBlockLockTimeExtension(convertWeeksToBlockNumbers(lockTimeValue));
  }, [lockTime]);

  React.useEffect(() => {
    reset({
      [LOCKING_AMOUNT]: '',
      [LOCK_TIME]: ''
    });
  }, [address, reset]);

  const votingBalanceGreaterThanZero = voteGovernanceTokenBalance?.gt(ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT);

  const extendLockTimeSet = votingBalanceGreaterThanZero && parseInt(lockTime) > 0;
  const increaseLockingAmountSet =
    votingBalanceGreaterThanZero && monetaryLockingAmount.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT);

  React.useEffect(() => {
    if (extendLockTimeSet) {
      trigger(LOCKING_AMOUNT);
    }
  }, [lockTime, extendLockTimeSet, trigger]);

  React.useEffect(() => {
    if (increaseLockingAmountSet) {
      trigger(LOCK_TIME);
    }
  }, [lockingAmount, increaseLockingAmountSet, trigger]);

  const getStakedAmount = () => {
    if (stakedAmountAndEndBlockIdle || stakedAmountAndEndBlockLoading) {
      return undefined;
    }
    if (stakedAmountAndEndBlock === undefined) {
      throw new Error('Something went wrong!');
    }

    return stakedAmountAndEndBlock.amount;
  };
  const stakedAmount = getStakedAmount();

  const availableBalance = React.useMemo(() => {
    if (
      governanceTokenBalanceIdle ||
      governanceTokenBalanceLoading ||
      stakedAmountAndEndBlockIdle ||
      stakedAmountAndEndBlockLoading ||
      transactionFeeReserveIdle ||
      transactionFeeReserveLoading
    )
      return;
    if (stakedAmount === undefined) {
      throw new Error('Staked amount value returned undefined!');
    }
    if (transactionFeeReserve === undefined) {
      throw new Error('Transaction fee reserve value returned undefined!');
    }
    if (governanceTokenBalance === undefined) {
      throw new Error('Governance token balance value returned undefined!');
    }

    const calculatedBalance = governanceTokenBalance.free.sub(stakedAmount).sub(transactionFeeReserve);

    return calculatedBalance.toBig().gte(0) ? calculatedBalance : newMonetaryAmount(0, GOVERNANCE_TOKEN);
  }, [
    governanceTokenBalanceIdle,
    governanceTokenBalanceLoading,
    governanceTokenBalance,
    stakedAmountAndEndBlockIdle,
    stakedAmountAndEndBlockLoading,
    stakedAmount,
    transactionFeeReserveIdle,
    transactionFeeReserveLoading,
    transactionFeeReserve
  ]);

  const onSubmit = (data: StakingFormData) => {
    if (!bridgeLoaded) return;
    if (currentBlockNumber === undefined) {
      throw new Error('Something went wrong!');
    }

    const lockingAmountWithFallback = data[LOCKING_AMOUNT] || '0';
    const lockTimeWithFallback = data[LOCK_TIME] || '0'; // Weeks

    const monetaryAmount = newMonetaryAmount(lockingAmountWithFallback, GOVERNANCE_TOKEN, true);
    const numberTime = parseInt(lockTimeWithFallback);

    if (votingBalanceGreaterThanZero) {
      moreStakeMutation.mutate({
        amount: monetaryAmount,
        time: numberTime
      });
    } else {
      initialStakeMutation.mutate({
        amount: monetaryAmount,
        time: numberTime
      });
    }
  };

  const validateLockingAmount = (value: string): string | undefined => {
    const valueWithFallback = value || '0';
    const monetaryLockingAmount = newMonetaryAmount(valueWithFallback, GOVERNANCE_TOKEN, true);

    if (!extendLockTimeSet && monetaryLockingAmount.lte(ZERO_GOVERNANCE_TOKEN_AMOUNT)) {
      return 'Locking amount must be greater than zero!';
    }

    if (availableBalance === undefined) {
      throw new Error('Something went wrong!');
    }
    if (monetaryLockingAmount.gt(availableBalance)) {
      return 'Locking amount must not be greater than available balance!';
    }

    const planckLockingAmount = monetaryLockingAmount.toBig(0);
    const lockBlocks = convertWeeksToBlockNumbers(parseInt(lockTime));
    // This is related to the on-chain implementation where currency values are integers.
    // So less tokens than the period would likely round to 0.
    // So on the UI, as long as you require more planck to be locked than the number of blocks the user locks for,
    // it should be good.
    if (!extendLockTimeSet && planckLockingAmount.lte(Big(lockBlocks))) {
      return 'Planck to be locked must be greater than the number of blocks you lock for!';
    }

    return undefined;
  };

  const validateLockTime = (value: string): string | undefined => {
    const valueWithFallback = value || '0';
    const numericValue = parseInt(valueWithFallback);

    if (votingBalanceGreaterThanZero && numericValue === 0 && monetaryLockingAmount.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT)) {
      return undefined;
    }

    if (availableLockTime === undefined) {
      throw new Error('Something went wrong!');
    }
    if (numericValue < STAKE_LOCK_TIME.MIN || numericValue > availableLockTime) {
      return `Please enter a number between ${STAKE_LOCK_TIME.MIN}-${availableLockTime}.`;
    }

    return undefined;
  };

  const renderVoteStakedAmountLabel = () => {
    if (voteGovernanceTokenBalanceIdle || voteGovernanceTokenBalanceLoading) {
      return '-';
    }
    if (voteGovernanceTokenBalance === undefined) {
      throw new Error('Something went wrong!');
    }

    return displayMonetaryAmount(voteGovernanceTokenBalance);
  };

  const renderProjectedRewardAmountLabel = () => {
    if (projectedRewardAmountAndAPYIdle || projectedRewardAmountAndAPYLoading) {
      return '-';
    }
    if (projectedRewardAmountAndAPY === undefined) {
      throw new Error('Something went wrong!');
    }

    return displayMonetaryAmount(projectedRewardAmountAndAPY.amount);
  };

  const renderStakedAmountLabel = () => {
    return stakedAmount === undefined ? '-' : displayMonetaryAmount(stakedAmount);
  };

  const hasStakedAmount = stakedAmount?.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT);

  const getRemainingBlockNumbersToUnstake = () => {
    if (
      stakedAmountAndEndBlockIdle ||
      stakedAmountAndEndBlockLoading ||
      currentBlockNumberIdle ||
      currentBlockNumberLoading
    ) {
      return undefined;
    }
    if (stakedAmountAndEndBlock === undefined) {
      throw new Error('Something went wrong!');
    }
    if (currentBlockNumber === undefined) {
      throw new Error('Something went wrong!');
    }

    return hasStakedAmount
      ? stakedAmountAndEndBlock.endBlock - currentBlockNumber // If the user has staked
      : null; // If the user has not staked
  };
  const remainingBlockNumbersToUnstake = getRemainingBlockNumbersToUnstake();

  const getAvailableLockTime = () => {
    if (remainingBlockNumbersToUnstake === undefined) {
      return undefined;
    }

    // If the user has staked
    if (hasStakedAmount) {
      if (remainingBlockNumbersToUnstake === null) {
        throw new Error('Something went wrong!');
      }
      const remainingWeeksToUnstake = convertBlockNumbersToWeeks(remainingBlockNumbersToUnstake);

      return Math.floor(STAKE_LOCK_TIME.MAX - remainingWeeksToUnstake);
      // If the user has not staked
    } else {
      return STAKE_LOCK_TIME.MAX;
    }
  };
  const availableLockTime = getAvailableLockTime();

  const availableMonetaryBalance = availableBalance?.toHuman(5);

  const renderUnlockDateLabel = () => {
    if (errors[LOCK_TIME]) {
      return '-';
    }

    const unlockDate = add(new Date(), {
      weeks: parseInt(lockTime)
    });

    return format(unlockDate, YEAR_MONTH_DAY_PATTERN);
  };

  const renderNewUnlockDateLabel = () => {
    if (remainingBlockNumbersToUnstake === undefined) {
      return '-';
    }
    if (errors[LOCK_TIME]) {
      return '-';
    }

    let remainingLockSeconds;
    if (hasStakedAmount) {
      if (remainingBlockNumbersToUnstake === null) {
        throw new Error('Something went wrong!');
      }

      remainingLockSeconds = remainingBlockNumbersToUnstake * BLOCK_TIME;
    } else {
      remainingLockSeconds = 0;
    }
    const unlockDate = add(new Date(), {
      weeks: parseInt(lockTime),
      seconds: remainingLockSeconds
    });

    return format(unlockDate, YEAR_MONTH_DAY_PATTERN);
  };

  const renderNewVoteGovernanceTokenGainedLabel = () => {
    const newTotalStakeAmount = getNewTotalStake();
    if (voteGovernanceTokenBalance === undefined || newTotalStakeAmount === undefined) {
      return '-';
    }

    const newVoteGovernanceTokenAmountGained = newTotalStakeAmount.sub(voteGovernanceTokenBalance);
    const rounded = newVoteGovernanceTokenAmountGained.toBig().round(5);
    const typed = newMonetaryAmount(rounded, VOTE_GOVERNANCE_TOKEN, true);

    return `${displayMonetaryAmount(typed)} ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`;
  };

  const getNewTotalStake = () => {
    if (remainingBlockNumbersToUnstake === undefined || stakedAmount === undefined) {
      return undefined;
    }

    const extendingLockTime = parseInt(lockTime); // Weeks

    let newLockTime: number;
    let newLockingAmount: GovernanceTokenMonetaryAmount;
    if (remainingBlockNumbersToUnstake === null) {
      // If the user has not staked
      newLockTime = extendingLockTime;
      newLockingAmount = monetaryLockingAmount;
    } else {
      // If the user has staked
      const currentLockTime = convertBlockNumbersToWeeks(remainingBlockNumbersToUnstake); // Weeks

      // New lock-time that is applied to the entire staked governance token
      newLockTime = currentLockTime + extendingLockTime; // Weeks

      // New total staked governance token
      newLockingAmount = monetaryLockingAmount.add(stakedAmount);
    }

    // Multiplying the new total staked governance token with the staking time divided by the maximum lock time
    return newLockingAmount.mul(newLockTime).div(STAKE_LOCK_TIME.MAX);
  };

  const renderNewTotalStakeLabel = () => {
    const newTotalStakeAmount = getNewTotalStake();
    if (newTotalStakeAmount === undefined) {
      return '-';
    }

    return `${displayMonetaryAmount(newTotalStakeAmount)} ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`;
  };

  const renderEstimatedAPYLabel = () => {
    if (
      estimatedRewardAmountAndAPYIdle ||
      estimatedRewardAmountAndAPYLoading ||
      errors[LOCK_TIME] ||
      errors[LOCKING_AMOUNT]
    ) {
      return '-';
    }
    if (estimatedRewardAmountAndAPY === undefined) {
      throw new Error('Something went wrong!');
    }

    return formatPercentage(estimatedRewardAmountAndAPY.apy.toNumber());
  };

  const renderEstimatedRewardAmountLabel = () => {
    if (
      estimatedRewardAmountAndAPYIdle ||
      estimatedRewardAmountAndAPYLoading ||
      errors[LOCK_TIME] ||
      errors[LOCKING_AMOUNT]
    ) {
      return '-';
    }
    if (estimatedRewardAmountAndAPY === undefined) {
      throw new Error('Something went wrong!');
    }

    return `${displayMonetaryAmount(estimatedRewardAmountAndAPY.amount)} ${GOVERNANCE_TOKEN_SYMBOL}`;
  };

  const renderClaimableRewardAmountLabel = () => {
    if (claimableRewardAmountIdle || claimableRewardAmountLoading) {
      return '-';
    }
    if (claimableRewardAmount === undefined) {
      throw new Error('Something went wrong!');
    }

    return displayMonetaryAmount(claimableRewardAmount);
  };

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: should be handled based on https://kentcdodds.com/blog/application-state-management-with-react
    if (!accountSet) {
      dispatch(showAccountModalAction(true));
      event.preventDefault();
    }
  };

  const valueInUSDOfLockingAmount = displayMonetaryAmountInUSDFormat(
    monetaryLockingAmount,
    getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd
  );

  const handleClickBalance = () => {
    setValue(LOCKING_AMOUNT, availableMonetaryBalance || '0');
    trigger(LOCKING_AMOUNT);
  };

  const claimRewardsButtonEnabled = claimableRewardAmount?.gt(ZERO_GOVERNANCE_TOKEN_AMOUNT);

  const unlockFirst =
    hasStakedAmount &&
    // eslint-disable-next-line max-len
    // `remainingBlockNumbersToUnstake !== null` is redundant because if `hasStakedAmount` is truthy `remainingBlockNumbersToUnstake` cannot be null
    remainingBlockNumbersToUnstake !== null &&
    remainingBlockNumbersToUnstake !== undefined &&
    remainingBlockNumbersToUnstake <= 0;

  const accountSet = !!address;

  const lockTimeFieldDisabled =
    votingBalanceGreaterThanZero === undefined ||
    remainingBlockNumbersToUnstake === undefined ||
    availableLockTime === undefined ||
    availableLockTime <= 0 ||
    unlockFirst;

  const lockingAmountFieldDisabled = availableBalance === undefined;

  const initializing =
    currentBlockNumberIdle ||
    currentBlockNumberLoading ||
    voteGovernanceTokenBalanceIdle ||
    voteGovernanceTokenBalanceLoading ||
    claimableRewardAmountIdle ||
    claimableRewardAmountLoading ||
    projectedRewardAmountAndAPYIdle ||
    projectedRewardAmountAndAPYLoading ||
    estimatedRewardAmountAndAPYIdle ||
    estimatedRewardAmountAndAPYLoading ||
    stakedAmountAndEndBlockIdle ||
    stakedAmountAndEndBlockLoading;

  let submitButtonLabel: string;
  if (initializing) {
    submitButtonLabel = 'Loading...';
  } else {
    if (accountSet) {
      // TODO: should improve readability by handling nested conditions
      if (votingBalanceGreaterThanZero) {
        const numericLockTime = parseInt(lockTime);
        if (checkIncreaseLockAmountAndExtendLockTime(numericLockTime, monetaryLockingAmount)) {
          submitButtonLabel = 'Add more stake and extend lock time';
        } else if (checkOnlyIncreaseLockAmount(numericLockTime, monetaryLockingAmount)) {
          submitButtonLabel = 'Add more stake';
        } else if (checkOnlyExtendLockTime(numericLockTime, monetaryLockingAmount)) {
          submitButtonLabel = 'Extend lock time';
        } else {
          submitButtonLabel = 'Stake';
        }
      } else {
        submitButtonLabel = 'Stake';
      }
    } else {
      submitButtonLabel = t('connect_wallet');
    }
  }

  return (
    <>
      <MainContainer>
        {process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA && (
          <WarningBanner className={SHARED_CLASSES} severity='alert'>
            <p>Block times are currently higher than expected. Lock times may be longer than expected.</p>
          </WarningBanner>
        )}
        <Panel className={SHARED_CLASSES}>
          <form className={clsx('p-8', 'space-y-8')} onSubmit={handleSubmit(onSubmit)}>
            <TitleWithUnderline text={`Stake ${GOVERNANCE_TOKEN_SYMBOL}`} />
            <BalancesUI
              stakedAmount={renderStakedAmountLabel()}
              voteStakedAmount={renderVoteStakedAmountLabel()}
              projectedRewardAmount={renderProjectedRewardAmountLabel()}
            />
            <ClaimRewardsButton
              claimableRewardAmount={renderClaimableRewardAmountLabel()}
              disabled={claimRewardsButtonEnabled === false}
            />
            {/* eslint-disable-next-line max-len */}
            {/* `remainingBlockNumbersToUnstake !== null` is redundant because if `hasStakedAmount` is truthy `remainingBlockNumbersToUnstake` cannot be null */}
            {hasStakedAmount && remainingBlockNumbersToUnstake !== null && (
              <WithdrawButton
                stakedAmount={renderStakedAmountLabel()}
                remainingBlockNumbersToUnstake={remainingBlockNumbersToUnstake}
              />
            )}
            <TotalsUI />
            <div className='space-y-2'>
              <AvailableBalanceUI
                label='Available balance'
                balance={
                  formatNumber(Number(availableMonetaryBalance), {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 5
                  }) || '-'
                }
                tokenSymbol={GOVERNANCE_TOKEN_SYMBOL}
                onClick={handleClickBalance}
              />
              <TokenField
                id={LOCKING_AMOUNT}
                label={GOVERNANCE_TOKEN_SYMBOL}
                min={0}
                {...register(LOCKING_AMOUNT, {
                  required: {
                    value: extendLockTimeSet ? false : true,
                    message: 'This field is required!'
                  },
                  validate: (value) => validateLockingAmount(value)
                })}
                approxUSD={`≈ ${valueInUSDOfLockingAmount}`}
                error={!!errors[LOCKING_AMOUNT]}
                helperText={errors[LOCKING_AMOUNT]?.message}
                disabled={lockingAmountFieldDisabled}
              />
            </div>
            <LockTimeField
              id={LOCK_TIME}
              min={0}
              {...register(LOCK_TIME, {
                required: {
                  value: votingBalanceGreaterThanZero ? false : true,
                  message: 'This field is required!'
                },
                validate: (value) => validateLockTime(value)
              })}
              error={!!errors[LOCK_TIME]}
              helperText={errors[LOCK_TIME]?.message}
              optional={votingBalanceGreaterThanZero}
              disabled={lockTimeFieldDisabled}
            />
            {votingBalanceGreaterThanZero ? (
              <InformationUI
                label='New unlock Date'
                value={renderNewUnlockDateLabel()}
                tooltip='Your original lock date plus the extended lock time.'
              />
            ) : (
              <InformationUI
                label='Unlock Date'
                value={renderUnlockDateLabel()}
                tooltip='Your staked amount will be locked until this date.'
              />
            )}
            <InformationUI
              label={t('staking_page.new_vote_governance_token_gained', {
                voteGovernanceTokenSymbol: VOTE_GOVERNANCE_TOKEN_SYMBOL
              })}
              value={renderNewVoteGovernanceTokenGainedLabel()}
              tooltip={t('staking_page.the_increase_in_your_vote_governance_token_balance', {
                voteGovernanceTokenSymbol: VOTE_GOVERNANCE_TOKEN_SYMBOL
              })}
            />
            {votingBalanceGreaterThanZero && (
              <InformationUI
                label='New total Stake'
                value={`${renderNewTotalStakeLabel()}`}
                tooltip='Your total stake after this transaction'
              />
            )}
            <InformationUI
              label='Estimated APR'
              value={renderEstimatedAPYLabel()}
              tooltip={`The APR may change as the amount of total ${VOTE_GOVERNANCE_TOKEN_SYMBOL} changes.`}
            />
            <InformationUI
              label={`Estimated ${GOVERNANCE_TOKEN_SYMBOL} Rewards`}
              value={renderEstimatedRewardAmountLabel()}
              tooltip={t('staking_page.the_estimated_amount_of_governance_token_you_will_receive_as_rewards', {
                governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL,
                voteGovernanceTokenSymbol: VOTE_GOVERNANCE_TOKEN_SYMBOL
              })}
            />
            <SubmitButton
              disabled={initializing || unlockFirst}
              pending={initialStakeMutation.isLoading || moreStakeMutation.isLoading}
              onClick={handleConfirmClick}
              endIcon={
                unlockFirst ? (
                  <InformationTooltip label='Please unstake first.' forDisabledAction={unlockFirst} />
                ) : null
              }
            >
              {submitButtonLabel}
            </SubmitButton>
          </form>
        </Panel>
      </MainContainer>
      {(initialStakeMutation.isError || moreStakeMutation.isError) && (
        <ErrorModal
          open={initialStakeMutation.isError || moreStakeMutation.isError}
          onClose={() => {
            initialStakeMutation.reset();
            moreStakeMutation.reset();
          }}
          title='Error'
          description={initialStakeMutation.error?.message || moreStakeMutation.error?.message || ''}
        />
      )}
    </>
  );
};

export default withErrorBoundary(Staking, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
