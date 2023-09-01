import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const { totalStaked, votingBalanceGained, apy, governanceBalanceReward, date } = data || {};

  const unlockDateTerm = hasStake ? t('staking_page.new_unlock_date') : t('staking_page.unlock_date');

  const unlockDateLabel = date ? format(date, YEAR_MONTH_DAY_PATTERN) : '-';

  return (
    <TransactionDetails {...props}>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>{unlockDateTerm}</TransactionDetailsDt>
        <TransactionDetailsDd>{unlockDateLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>
          {t('staking_page.new_ticker_gained', { ticker: VOTE_GOVERNANCE_TOKEN.ticker })}
        </TransactionDetailsDt>
        <TransactionDetailsDd>
          {votingBalanceGained?.toHuman() || 0} {VOTE_GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
      {hasStake && (
        <TransactionDetailsGroup>
          <TransactionDetailsDt>{t('staking_page.new_total_stake')}</TransactionDetailsDt>
          <TransactionDetailsDd>
            {totalStaked?.toHuman() || 0} {VOTE_GOVERNANCE_TOKEN.ticker}
          </TransactionDetailsDd>
        </TransactionDetailsGroup>
      )}
      <TransactionDetailsGroup>
        <TransactionDetailsDt>{t('staking_page.estimated_apr')}</TransactionDetailsDt>
        <TransactionDetailsDd>{formatPercentage(apy?.toNumber() || 0)}</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>
          {t('staking_page.projected_ticker_rewards', { ticker: GOVERNANCE_TOKEN.ticker })}
        </TransactionDetailsDt>
        <TransactionDetailsDd>
          {governanceBalanceReward?.toHuman() || 0} {GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StakingTransactionDetails };
export type { StakingTransactionDetailsProps };
