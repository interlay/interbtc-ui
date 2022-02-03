
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import {
  format,
  add
} from 'date-fns';
import {
  MonetaryAmount,
  Currency,
  KintsugiAmount
} from '@interlay/monetary-js';
import {
  GovernanceUnit,
  newMonetaryAmount
} from '@interlay/interbtc-api';

import Title from './Title';
import BalancesUI from './BalancesUI';
// import UnstakeButton from './UnstakeButton';
import GovernanceTokenBalanceUI from './GovernanceTokenBalanceUI';
import InformationUI from './InformationUI';
import LockTimeField from './LockTimeField';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';
import TokenField from 'components/TokenField';
import SubmitButton from 'components/SubmitButton';
import ErrorFallback from 'components/ErrorFallback';
import {
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  VOTE_GOVERNANCE_TOKEN
} from 'config/relay-chains';
import {
  MIN_LOCK_TIME,
  MAX_LOCK_TIME
} from 'config/staking';
import { YEAR_MONTH_DAY_PATTERN } from 'utils/constants/date-time';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const ZERO_VOTE_GOVERNANCE_AMOUNT = newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true);

const STAKING_AMOUNT = 'staking-amount';
const LOCK_TIME = 'lock-time';

type StakingFormData = {
  [STAKING_AMOUNT]: string;
  [LOCK_TIME]: string;
}

const Staking = (): JSX.Element => {
  const {
    governanceTokenBalance,
    bridgeLoaded,
    address,
    prices
  } = useSelector((state: StoreType) => state.general);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<StakingFormData>({
    mode: 'onChange' // 'onBlur'
  });
  const stakingAmount = watch(STAKING_AMOUNT) || '0';
  const lockTime = watch(LOCK_TIME) || '0';

  const {
    isIdle: votingBalanceIdle,
    isLoading: votingBalanceLoading,
    data: votingBalance,
    error: votingBalanceError
  } = useQuery<MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'escrow',
      'votingBalance',
      address
    ],
    genericFetcher<MonetaryAmount<Currency<GovernanceUnit>, GovernanceUnit>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(votingBalanceError);

  if (votingBalanceIdle || votingBalanceLoading) {
    return <>Loading...</>;
  }
  if (votingBalance === undefined) {
    throw new Error('Something went wrong!');
  }

  const onSubmit = (data: StakingFormData) => {
    console.log('[validateStakingAmount] data => ', data);
  };

  const validateStakingAmount = (value: string): string | undefined => {
    console.log('[validateStakingAmount] value => ', value);

    return undefined;
  };

  const validateLockTime = (value: number): string | undefined => {
    if (value < MIN_LOCK_TIME || value > MAX_LOCK_TIME) {
      return `Please enter a number between ${MIN_LOCK_TIME}-${MAX_LOCK_TIME}.`;
    }

    return undefined;
  };

  const governanceTokenBalanceLabel = displayMonetaryAmount(governanceTokenBalance);
  const votingBalanceLabel = displayMonetaryAmount(votingBalance);
  const monetaryStakingAmount = KintsugiAmount.from.KINT(stakingAmount);
  const usdStakingAmount = getUsdAmount(monetaryStakingAmount, prices.governanceToken.usd);

  const unlockDate = add(new Date(), {
    weeks: parseInt(lockTime)
  });
  const unlockDateLabel = format(unlockDate, YEAR_MONTH_DAY_PATTERN);

  const lockTimeOptional = votingBalance.gt(ZERO_VOTE_GOVERNANCE_AMOUNT);

  return (
    <MainContainer>
      <Panel
        className={clsx(
          'mx-auto',
          'w-full',
          'md:max-w-xl'
        )}>
        <form
          className={clsx(
            'p-8',
            'space-y-8'
          )}
          onSubmit={handleSubmit(onSubmit)}>
          <Title />
          <BalancesUI
            governanceTokenBalance={governanceTokenBalanceLabel}
            voteGovernanceTokenBalance={votingBalanceLabel} />
          {/* ray test touch << */}
          {/* <UnstakeButton /> */}
          {/* ray test touch >> */}
          <div className='space-y-2'>
            <GovernanceTokenBalanceUI balance={governanceTokenBalanceLabel} />
            <TokenField
              id={STAKING_AMOUNT}
              name={STAKING_AMOUNT}
              label={GOVERNANCE_TOKEN_SYMBOL}
              min={0}
              ref={register({
                required: {
                  value: true,
                  message: 'This field is required!'
                },
                validate: value => validateStakingAmount(value)
              })}
              approxUSD={`≈ $ ${usdStakingAmount}`}
              error={!!errors[STAKING_AMOUNT]}
              helperText={errors[STAKING_AMOUNT]?.message} />
          </div>
          <LockTimeField
            id={LOCK_TIME}
            name={LOCK_TIME}
            min={0}
            ref={register({
              required: {
                value: lockTimeOptional ? false : true,
                message: 'This field is required!'
              },
              validate: value => validateLockTime(value)
            })}
            error={!!errors[LOCK_TIME]}
            helperText={errors[LOCK_TIME]?.message}
            optional={lockTimeOptional} />
          <InformationUI
            label='Unlock date'
            value={unlockDateLabel}
            tooltip='Your staked amount will be locked until this date.' />
          <InformationUI
            label='Estimated APY'
            value='12.24%'
            // eslint-disable-next-line max-len
            tooltip={`The estimated amount of KINT you will receive as rewards. Depends on your proportion of the total ${VOTE_GOVERNANCE_TOKEN_SYMBOL}.`} />
          {/* ray test touch << */}
          {/* <InformationUI
            label='New unlock date'
            value='Dec 16, 2023'
            tooltip='Your original lock date plus the extended lock time.' />
          <InformationUI
            label='New total stake'
            value={`40.00 ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
            tooltip='Your total stake after this transaction.' />
          <InformationUI
            label={`Estimated ${GOVERNANCE_TOKEN_SYMBOL} Rewards`}
            value={`156.43  ${GOVERNANCE_TOKEN_SYMBOL}`}
            tooltip={`The APY may change as the amount of total ${VOTE_GOVERNANCE_TOKEN_SYMBOL} changes`} /> */}
          {/* ray test touch >> */}
          <SubmitButton>
            Stake
          </SubmitButton>
        </form>
      </Panel>
    </MainContainer>
  );
};

export default withErrorBoundary(Staking, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
