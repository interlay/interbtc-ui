
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
import Panel from 'components/Panel';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import graphqlFetcher, {
  GraphqlReturn,
  GRAPHQL_FETCHER
} from 'services/fetchers/graphql-fetcher';
import issueCountQuery from 'services/queries/issue-count-query';

const UpperContent = (): JSX.Element => {
  const {
    totalWrappedTokenAmount,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssues,
    error: totalSuccessfulIssuesError
  // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [
      GRAPHQL_FETCHER,
      issueCountQuery('status_eq: Completed')
    ],
    graphqlFetcher<GraphqlReturn<any>>()
  );
  useErrorHandler(totalSuccessfulIssuesError);

  // TODO: should use skeleton loaders
  if (totalSuccessfulIssuesIdle || totalSuccessfulIssuesLoading) {
    return <>Loading...</>;
  }
  if (totalSuccessfulIssues === undefined) {
    throw new Error('Something went wrong!');
  }
  const totalSuccessfulIssueCount = totalSuccessfulIssues.data.issuesConnection.totalCount;

  return (
    <Panel
      className={clsx(
        'grid',
        'sm:grid-cols-2',
        'gap-5',
        'px-4',
        'py-5'
      )}>
      <Stats
        leftPart={
          <>
            <StatsDt
              className={clsx(
                { '!text-interlayDenim':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:!text-kintsugiSupernova':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}>
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
              {totalSuccessfulIssueCount}
            </StatsDd>
          </>
        } />
      <IssuedChart />
    </Panel>
  );
};

export default withErrorBoundary(UpperContent, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
