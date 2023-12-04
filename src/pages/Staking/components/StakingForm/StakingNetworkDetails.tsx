import { useTranslation } from 'react-i18next';

import { formatLargeNumber } from '@/common/utils/utils';
import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps
} from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { NetworkStakingData } from '@/hooks/api/escrow/uset-get-network-staking-data';

type Props = {
  data: NetworkStakingData;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type StakingNetworkDetailsProps = Props & InheritAttrs;

const StakingNetworkDetails = ({ data, ...props }: StakingNetworkDetailsProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <TransactionDetails {...props}>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>
          {t('staking_page.total_staked_ticker_in_the_network', { ticker: GOVERNANCE_TOKEN.ticker })}
        </TransactionDetailsDt>
        <TransactionDetailsDd>
          {formatLargeNumber(data.totalStakedBalance.toBig().toNumber())} {GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>
          {t('staking_page.total_ticker_in_the_network', { ticker: VOTE_GOVERNANCE_TOKEN.ticker })}
        </TransactionDetailsDt>
        <TransactionDetailsDd>
          {formatLargeNumber(data.totalVotingSupply.toBig().toNumber())} {VOTE_GOVERNANCE_TOKEN.ticker}
        </TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { StakingNetworkDetails };
export type { StakingNetworkDetailsProps };
