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

const StakingNetworkDetails = ({ data, ...props }: StakingNetworkDetailsProps): JSX.Element => (
  <TransactionDetails {...props}>
    <TransactionDetailsGroup>
      <TransactionDetailsDt>Total Staked {GOVERNANCE_TOKEN.ticker} in the network</TransactionDetailsDt>
      <TransactionDetailsDd>
        {data.totalStakedBalance.toHuman()} {GOVERNANCE_TOKEN.ticker}
      </TransactionDetailsDd>
    </TransactionDetailsGroup>
    <TransactionDetailsGroup>
      <TransactionDetailsDt>Total {VOTE_GOVERNANCE_TOKEN.ticker} in the network</TransactionDetailsDt>
      <TransactionDetailsDd>
        {data.totalVotingSupply.toHuman()} {VOTE_GOVERNANCE_TOKEN.ticker}
      </TransactionDetailsDd>
    </TransactionDetailsGroup>
  </TransactionDetails>
);

export { StakingNetworkDetails };
export type { StakingNetworkDetailsProps };
