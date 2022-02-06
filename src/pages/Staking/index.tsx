
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  useQuery,
  useMutation,
  useQueryClient
} from 'react-query';
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
import UnstakeButton from './UnstakeButton';
import GovernanceTokenBalanceUI from './GovernanceTokenBalanceUI';
import InformationUI from './InformationUI';
import LockTimeField from './LockTimeField';
import MainContainer from 'parts/MainContainer';
import Panel from 'components/Panel';
import TokenField from 'components/TokenField';
import SubmitButton from 'components/SubmitButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import {
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  GOVERNANCE_TOKEN_SYMBOL,
  VOTE_GOVERNANCE_TOKEN,
  GovernanceTokenAmount,
  GOVERNANCE_TOKEN
} from 'config/relay-chains';
import {
  MIN_LOCK_TIME,
  MAX_LOCK_TIME
} from 'config/staking';
import { BLOCK_TIME } from 'config/parachain';
import { YEAR_MONTH_DAY_PATTERN } from 'utils/constants/date-time';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const getUnlockDateLabel = (weeks: number) => {
  if (weeks >= MIN_LOCK_TIME) {
    const unlockDate = add(new Date(), {
      weeks
    });
    return format(unlockDate, YEAR_MONTH_DAY_PATTERN);
  } else {
    return '-';
  }
};

const ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, VOTE_GOVERNANCE_TOKEN, true);
const ZERO_GOVERNANCE_TOKEN_AMOUNT = newMonetaryAmount(0, GOVERNANCE_TOKEN, true);

const STAKING_AMOUNT = 'staking-amount';
const LOCK_TIME = 'lock-time';

type StakingFormData = {
  [STAKING_AMOUNT]: string;
  [LOCK_TIME]: string;
}

interface Stake {
  amount: GovernanceTokenAmount;
  unlockHeight: number;
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
    reset,
    formState: { errors }
  } = useForm<StakingFormData>({
    mode: 'onChange' // 'onBlur'
  });
  const stakingAmount = watch(STAKING_AMOUNT) || '0';
  const lockTime = watch(LOCK_TIME) || '0';

  const {
    isIdle: voteGovernanceTokenIdle,
    isLoading: voteGovernanceTokenLoading,
    data: voteGovernanceTokenBalance,
    error: voteGovernanceTokenError
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
  useErrorHandler(voteGovernanceTokenError);

  const queryClient = useQueryClient();

  const stakeMutation = useMutation<void, Error, Stake>(
    (variables: Stake) => {
      // ray test touch <<
      // TODO: https://github.com/interlay/interbtc-api/blob/master/test/integration/parachain/staging/escrow.test.ts
      // TODO: double-check
      return (window.bridge.interBtcApi as any).escrow.createLock(variables.amount, variables.unlockHeight);
      // ray test touch >>
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          GENERIC_FETCHER,
          'interBtcApi',
          'escrow',
          'votingBalance',
          address
        ]);
        console.log('[stakeMutation] variables => ', variables);
        reset({
          [STAKING_AMOUNT]: '0.0',
          [LOCK_TIME]: '0'
        });
      },
      onError: error => {
        // TODO: should add error handling UX
        console.log('[stakeMutation] error => ', error);
      }
    }
  );

  const onSubmit = (data: StakingFormData) => {
    if (!bridgeLoaded) return;

    const monetaryAmount = newMonetaryAmount(data[STAKING_AMOUNT], GOVERNANCE_TOKEN, true);

    const lockTime = parseInt(data[LOCK_TIME]); // Weeks
    const unlockHeight = (lockTime * 7 * 24 * 3600) / BLOCK_TIME;

    stakeMutation.mutate({
      // TODO: double-check
      amount: (monetaryAmount as GovernanceTokenAmount),
      unlockHeight
    });
  };

  const validateStakingAmount = (value = '0'): string | undefined => {
    const monetaryStakingAmount = newMonetaryAmount(value, GOVERNANCE_TOKEN, true);

    if (monetaryStakingAmount.lte(ZERO_GOVERNANCE_TOKEN_AMOUNT)) {
      return 'Staking amount must be greater than zero!';
    }

    if (monetaryStakingAmount.gt(governanceTokenBalance)) {
      return 'Staking amount must be less than governance token balance!';
    }

    return undefined;
  };

  const validateLockTime = (value = '0', optional: boolean): string | undefined => {
    const numericValue = parseInt(value);

    if (optional && numericValue === 0) {
      return undefined;
    }

    if (numericValue < MIN_LOCK_TIME || numericValue > MAX_LOCK_TIME) {
      return `Please enter a number between ${MIN_LOCK_TIME}-${MAX_LOCK_TIME}.`;
    }

    return undefined;
  };

  const governanceTokenBalanceLabel = displayMonetaryAmount(governanceTokenBalance);
  const votingBalanceLabel = voteGovernanceTokenBalance ? displayMonetaryAmount(voteGovernanceTokenBalance) : '-';
  const monetaryStakingAmount = KintsugiAmount.from.KINT(stakingAmount);
  const usdStakingAmount = getUsdAmount(monetaryStakingAmount, prices.governanceToken.usd);
  const unlockDateLabel = getUnlockDateLabel(parseInt(lockTime));
  const votingBalanceGreaterThanZero = voteGovernanceTokenBalance?.gt(ZERO_VOTE_GOVERNANCE_TOKEN_AMOUNT);

  const initializing =
    voteGovernanceTokenIdle ||
    voteGovernanceTokenLoading;
  let submitButtonLabel: string;
  if (initializing) {
    submitButtonLabel = 'Loading...';
  } else {
    submitButtonLabel = 'Stake';
  }

  return (
    <>
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
            {votingBalanceGreaterThanZero && (
              <UnstakeButton />
            )}
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
                  value: votingBalanceGreaterThanZero ? false : true,
                  message: 'This field is required!'
                },
                validate: value => validateLockTime(value, !!votingBalanceGreaterThanZero)
              })}
              error={!!errors[LOCK_TIME]}
              helperText={errors[LOCK_TIME]?.message}
              optional={votingBalanceGreaterThanZero}
              disabled={votingBalanceGreaterThanZero === undefined} />
            <InformationUI
              label='Unlock date'
              value={unlockDateLabel}
              tooltip='Your staked amount will be locked until this date.' />
            <InformationUI
              label='Estimated APY'
              value='12.24% (hardcoded)'
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
            <SubmitButton
              disabled={initializing}
              pending={stakeMutation.isLoading}>
              {submitButtonLabel}
            </SubmitButton>
          </form>
        </Panel>
      </MainContainer>
      {stakeMutation.isError && (
        <ErrorModal
          open={stakeMutation.isError}
          onClose={() => {
            stakeMutation.reset();
          }}
          title='Error'
          description={
            stakeMutation.error?.message || ''
          } />
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
