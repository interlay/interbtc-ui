import { format } from 'date-fns';

import { formatPercentage } from '@/common/utils/utils';
import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps
} from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { AccountStakingDetailsData } from '@/hooks/api/escrow/use-get-staking-details-data';
import { YEAR_MONTH_DAY_PATTERN } from '@/utils/constants/date-time';

type Props = {
  hasStake: boolean;
  data?: AccountStakingDetailsData;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type StakingTransactionDetailsProps = Props & InheritAttrs;

const StakingTransactionDetails = ({ hasStake, data, ...props }: StakingTransactionDetailsProps): JSX.Element => {
  const { totalStaked, votingBalanceGained, apy, governanceBalanceReward, date } = data || {};

  const unlockDateTerm = hasStake ? 'New unlock date' : 'Unlock date';

  const unlockDateLabel = date ? format(date, YEAR_MONTH_DAY_PATTERN) : '-';

  console.log(unlockDateLabel);

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
      {hasStake && (
        <TransactionDetailsGroup>
          <TransactionDetailsDt>New Total Stake</TransactionDetailsDt>
          <TransactionDetailsDd>
            {totalStaked?.toHuman() || 0} {VOTE_GOVERNANCE_TOKEN.ticker}
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
      )}
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Estimated APR</TransactionDetailsDt>
        <TransactionDetailsDd>{formatPercentage(apy?.toNumber() || 0)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>Projected {GOVERNANCE_TOKEN.ticker} Rewards</TransactionDetailsDt>
        <TransactionDetailsDd>
          {governanceBalanceReward?.toHuman() || 0} {GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StakingTransactionDetails };
export type { StakingTransactionDetailsProps };
