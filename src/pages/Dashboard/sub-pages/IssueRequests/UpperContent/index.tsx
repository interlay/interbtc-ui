
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import clsx from 'clsx';

import IssuedChart from 'pages/Dashboard/IssuedChart';
import Stats, {
  StatsDt,
  StatsDd
} from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import issueCountQuery from 'services/queries/issueRequestCount';

const UpperContent = (): JSX.Element => {
  const {
    totalWrappedTokenAmount,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssuesData,
    error: totalSuccessfulIssuesError
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery('status_eq: Completed')
    ],
    graphqlFetcher<any>()
  );
  useErrorHandler(totalSuccessfulIssuesError);

  // TODO: should use skeleton loaders
  if (totalSuccessfulIssuesIdle || totalSuccessfulIssuesLoading) {
    return <>Loading...</>;
  }
  if (!totalSuccessfulIssuesData) {
    throw new Error('Something went wrong!');
  }
  const totalSuccessfulIssues = totalSuccessfulIssuesData.data.issuesConnection.totalCount;

  return (
    <div
      className={clsx(
        'grid',
        'sm:grid-cols-2',
        'gap-5'
      )}>
      <Stats
        leftPart={
          <>
            {/* ray test touch << */}
            <StatsDt className='!text-interlayDenim'>
              {/* ray test touch >> */}
              {t('dashboard.issue.issued')}
            </StatsDt>
            <StatsDd>
              {t('dashboard.issue.total_interbtc', {
                amount: displayMonetaryAmount(totalWrappedTokenAmount),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </StatsDd>
            <StatsDd>
              ${getUsdAmount(totalWrappedTokenAmount, prices.bitcoin.usd).toLocaleString()}
            </StatsDd>
            <StatsDt className='!text-interlayConifer'>
              {t('dashboard.issue.issue_requests')}
            </StatsDt>
            <StatsDd>
              {totalSuccessfulIssues}
            </StatsDd>
          </>
        } />
      <div
        className={clsx(
          'border',
          'rounded'
        )}>
        <IssuedChart />
      </div>
    </div>
  );
};

export default withErrorBoundary(UpperContent, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
