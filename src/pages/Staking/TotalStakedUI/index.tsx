
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useSelector } from 'react-redux';

import InformationUI from '../InformationUI';
import ErrorFallback from 'components/ErrorFallback';
import {
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  VoteGovernanceTokenMonetaryAmount
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// TODO:
// - Invalidate `totalVotingSupply` on new stakes

const TotalStakedUI = (): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: totalVotingSupplyIdle,
    isLoading: totalVotingSupplyLoading,
    data: totalVotingSupply,
    error: totalVotingSupplyError
  } = useQuery<VoteGovernanceTokenMonetaryAmount, Error>(
    [
      GENERIC_FETCHER,
      'escrow',
      'totalVotingSupply'
    ],
    genericFetcher<VoteGovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalVotingSupplyError);

  let totalStakedVoteGovernanceTokenAmountLabel;
  if (
    totalVotingSupplyIdle ||
    totalVotingSupplyLoading
  ) {
    totalStakedVoteGovernanceTokenAmountLabel = '-';
  } else {
    if (totalVotingSupply === undefined) {
      throw new Error('Something went wrong!');
    }
    totalStakedVoteGovernanceTokenAmountLabel = displayMonetaryAmount(totalVotingSupply);
  }

  return (
    <div>
      <InformationUI
        label={`Total Staked ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
        value={`${totalStakedVoteGovernanceTokenAmountLabel} ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`} />
    </div>
  );
};

export default withErrorBoundary(TotalStakedUI, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
