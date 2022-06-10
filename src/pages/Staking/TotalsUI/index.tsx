import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import { VOTE_GOVERNANCE_TOKEN_SYMBOL, VoteGovernanceTokenMonetaryAmount } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';

import InformationUI from '../InformationUI';

const TotalsUI = (): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: totalVotingSupplyIdle,
    isLoading: totalVotingSupplyLoading,
    data: totalVotingSupply,
    error: totalVotingSupplyError
  } = useQuery<VoteGovernanceTokenMonetaryAmount, Error>(
    [GENERIC_FETCHER, 'escrow', 'totalVotingSupply'],
    genericFetcher<VoteGovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalVotingSupplyError);

  let totalStakedVoteGovernanceTokenAmountLabel;
  if (totalVotingSupplyIdle || totalVotingSupplyLoading) {
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
        label={`Total ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
        value={`${totalStakedVoteGovernanceTokenAmountLabel} ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
      />
    </div>
  );
};

export default withErrorBoundary(TotalsUI, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
