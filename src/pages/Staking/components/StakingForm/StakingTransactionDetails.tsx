import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps
} from '@/components';
import { GOVERNANCE_TOKEN, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type StakingTransactionDetailsProps = Props & InheritAttrs;

const StakingTransactionDetails = ({ ...props }: StakingTransactionDetailsProps): JSX.Element | null => {
  return (
    <TransactionDetails {...props}>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New unlock date</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New {VOTE_GOVERNANCE_TOKEN.ticker} Gained</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
      </TransactionDetailsGroup>
      <TransactionDetailsGroup>
        <TransactionDetailsDt>New Total Stake</TransactionDetailsDt>
        <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
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
