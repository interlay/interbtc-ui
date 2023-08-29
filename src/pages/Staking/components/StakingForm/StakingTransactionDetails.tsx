import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { add, format } from 'date-fns';

import { formatPercentage } from '@/common/utils/utils';
import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps
} from '@/components';
import { GOVERNANCE_TOKEN, STAKE_LOCK_TIME, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingData } from '@/hooks/api/escrow/use-get-account-staking-data';
import { AccountStakingEstimationData } from '@/hooks/api/escrow/use-get-staking-estimation-data';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';
import { convertBlockNumbersToWeeks } from '@/utils/helpers/staking';

const getData = (accountData: AccountStakingData | null, amount: MonetaryAmount<CurrencyExt>, weeksLocked = 0) => {
  if (!accountData && (amount.isZero() || !weeksLocked)) return;

  if (accountData && amount.isZero() && !weeksLocked) return;

  const existingWeeksLocked = accountData ? convertBlockNumbersToWeeks(accountData.unlock.remainingBlocks) : 0;

  const totalWeeksLocked = existingWeeksLocked + weeksLocked;

  const totalStakedAmount = accountData ? accountData.balance.add(amount) : amount;

  const newTotalStaked = totalStakedAmount.mul(totalWeeksLocked).div(STAKE_LOCK_TIME.MAX);

  const votingBalanceGained = accountData ? newTotalStaked.sub(accountData?.votingBalance) : newTotalStaked;

  return {
    votingBalanceGained,
    newTotalStaked
  };
};

type Props = {
  accountData: AccountStakingData | null;
  estimation?: AccountStakingEstimationData;
  amount: MonetaryAmount<CurrencyExt>;
  weeksLocked?: number;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type StakingTransactionDetailsProps = Props & InheritAttrs;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StakingTransactionDetails = ({
  accountData,
  estimation,
  amount,
  weeksLocked = 0,
  ...props
}: StakingTransactionDetailsProps): JSX.Element | null => {
  const unlockDateTerm = accountData ? 'New unlock date' : 'Unlock date';

  const newDate = add(accountData?.unlock.date || new Date(), {
    weeks: weeksLocked
  });

  const unlockDateLabel = format(newDate, YEAR_MONTH_DAY_PATTERN);

  const { newTotalStaked, votingBalanceGained } = getData(accountData, amount, weeksLocked) || {};

  return (
    <TransactionDetails {...props}>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>{unlockDateTerm}</TransactionDetailsDt>
        <TransactionDetailsDd>{unlockDateLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New {VOTE_GOVERNANCE_TOKEN.ticker} Gained</TransactionDetailsDt>
        <TransactionDetailsDd>
          {votingBalanceGained?.toHuman() || 0} {VOTE_GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
      {accountData && (
        <TransactionDetailsGroup>
          <TransactionDetailsDt>New Total Stake</TransactionDetailsDt>
          <TransactionDetailsDd>
            {newTotalStaked?.toHuman() || 0} {VOTE_GOVERNANCE_TOKEN.ticker}
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
      )}
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Estimated APR</TransactionDetailsDt>
        <TransactionDetailsDd>{formatPercentage(estimation?.apy.toNumber() || 0)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Projected {GOVERNANCE_TOKEN.ticker} Rewards</TransactionDetailsDt>
        <TransactionDetailsDd>
          {estimation?.amount.toHuman() || 0} {GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StakingTransactionDetails };
export type { StakingTransactionDetailsProps };
