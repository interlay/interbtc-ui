import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { add, differenceInWeeks, format } from 'date-fns';

import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps
} from '@/components';
import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { STAKING_LOCK_TIME_AMOUNT_FIELD, StakingFormData } from '@/lib/form';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

type Props = { accountData: AccountStakingData | null; amount: MonetaryAmount<CurrencyExt>; form: StakingFormData };

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type StakingTransactionDetailsProps = Props & InheritAttrs;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StakingTransactionDetails = ({
  accountData,
  amount,
  form,
  ...props
}: StakingTransactionDetailsProps): JSX.Element | null => {
  const unlockDateTerm = accountData ? 'New unlock date' : 'Unlock date';

  const newDate = add(accountData?.unlock.date || new Date(), {
    weeks: form[STAKING_LOCK_TIME_AMOUNT_FIELD]
  });

  const unlockDateLabel = format(newDate, YEAR_MONTH_DAY_PATTERN);

  const remainingWeeks = differenceInWeeks(newDate, new Date());

  const newStakedAmount = accountData ? accountData.balance.add(amount) : amount;

  const newTotalStaked = newStakedAmount.mul(remainingWeeks).div(STAKE_LOCK_TIME.MAX);

  // const extendingLockTime = parseInt(lockTime); // Weeks

  // let newLockTime: number;
  // let newLockingAmount: GovernanceTokenMonetaryAmount;
  // if (remainingBlockNumbersToUnstake === null) {
  //   // If the user has not staked
  //   newLockTime = extendingLockTime;
  //   newLockingAmount = monetaryLockingAmount;
  // } else {
  //   // If the user has staked
  //   const currentLockTime = convertBlockNumbersToWeeks(remainingBlockNumbersToUnstake); // Weeks

  //   // New lock-time that is applied to the entire staked governance token
  //   newLockTime = currentLockTime + extendingLockTime; // Weeks

  //   // New total staked governance token
  //   newLockingAmount = monetaryLockingAmount.add(stakedAmount);
  // }

  // // Multiplying the new total staked governance token with the staking time divided by the maximum lock time
  // return newLockingAmount.mul(newLockTime).div(STAKE_LOCK_TIME.MAX);

  return (
    <TransactionDetails {...props}>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>{unlockDateTerm}</TransactionDetailsDt>
        <TransactionDetailsDd>{unlockDateLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New {VOTE_GOVERNANCE_TOKEN.ticker} Gained</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New Total Stake</TransactionDetailsDt>
        <TransactionDetailsDd>
          {newTotalStaked.toHuman()} {VOTE_GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Estimated APR</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Projected {GOVERNANCE_TOKEN.ticker} Rewards</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StakingTransactionDetails };
export type { StakingTransactionDetailsProps };
