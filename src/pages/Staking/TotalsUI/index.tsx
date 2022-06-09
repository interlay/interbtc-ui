import { useQuery } from 'react-query';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';

import InformationUI from '../InformationUI';
import ErrorFallback from 'components/ErrorFallback';
import {
  VOTE_GOVERNANCE_TOKEN_SYMBOL,
  VoteGovernanceTokenMonetaryAmount,
  GovernanceTokenMonetaryAmount,
  GOVERNANCE_TOKEN_SYMBOL
} from 'config/relay-chains';
import { displayMonetaryAmount } from 'common/utils/utils';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const TotalsUI = (): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: totalVoteGovernanceTokenAmountIdle,
    isLoading: totalVoteGovernanceTokenAmountLoading,
    data: totalVoteGovernanceTokenAmount,
    error: totalVoteGovernanceTokenAmountError
  } = useQuery<VoteGovernanceTokenMonetaryAmount, Error>(
    [GENERIC_FETCHER, 'escrow', 'totalVotingSupply'],
    genericFetcher<VoteGovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalVoteGovernanceTokenAmountError);

  const {
    isIdle: totalStakedGovernanceTokenAmountIdle,
    isLoading: totalStakedGovernanceTokenAmountLoading,
    data: totalStakedGovernanceTokenAmount,
    error: totalStakedGovernanceTokenAmountError
  } = useQuery<GovernanceTokenMonetaryAmount, Error>(
    [GENERIC_FETCHER, 'escrow', 'getTotalStakedBalance'],
    genericFetcher<VoteGovernanceTokenMonetaryAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalStakedGovernanceTokenAmountError);

  let totalVoteGovernanceTokenAmountLabel;
  if (totalVoteGovernanceTokenAmountIdle || totalVoteGovernanceTokenAmountLoading) {
    totalVoteGovernanceTokenAmountLabel = '-';
  } else {
    if (totalVoteGovernanceTokenAmount === undefined) {
      throw new Error('Something went wrong!');
    }
    totalVoteGovernanceTokenAmountLabel = displayMonetaryAmount(totalVoteGovernanceTokenAmount);
  }

  let totalStakedGovernanceTokenAmountLabel;
  if (totalStakedGovernanceTokenAmountIdle || totalStakedGovernanceTokenAmountLoading) {
    totalStakedGovernanceTokenAmountLabel = '-';
  } else {
    if (totalStakedGovernanceTokenAmount === undefined) {
      throw new Error('Something went wrong!');
    }
    totalStakedGovernanceTokenAmountLabel = displayMonetaryAmount(totalStakedGovernanceTokenAmount);
  }

  return (
    <div>
      <InformationUI
        label={`Total ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
        value={`${totalVoteGovernanceTokenAmountLabel} ${VOTE_GOVERNANCE_TOKEN_SYMBOL}`}
      />
      <InformationUI
        label={`Total Staked ${GOVERNANCE_TOKEN_SYMBOL}`}
        value={`${totalStakedGovernanceTokenAmountLabel} ${GOVERNANCE_TOKEN_SYMBOL}`}
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
