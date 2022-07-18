import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, getUsdAmount } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import Panel from '@/components/Panel';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import IssuedChart from '@/pages/Dashboard/IssuedChart';
import Stats, { StatsDd, StatsDt } from '@/pages/Dashboard/Stats';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import issueCountQuery from '@/services/queries/issue-count-query';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

const UpperContent = (): JSX.Element => {
  const { totalWrappedTokenAmount } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const prices = useGetPrices();

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssues,
    error: totalSuccessfulIssuesError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, issueCountQuery('status_eq: Completed')],
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
    <Panel className={clsx('grid', 'sm:grid-cols-2', 'gap-5', 'px-4', 'py-5')}>
      <Stats
        leftPart={
          <>
            <StatsDt
              className={clsx(
                { '!text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
                { 'dark:!text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
              )}
            >
              {t('dashboard.issue.issued')}
            </StatsDt>
            <StatsDd>
              {t('dashboard.issue.total_interbtc', {
                amount: displayMonetaryAmount(totalWrappedTokenAmount),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </StatsDd>
            <StatsDd>
              $
              {getUsdAmount(
                totalWrappedTokenAmount,
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              ).toLocaleString()}
            </StatsDd>
            <StatsDt className={`!${getColorShade('green')}`}>{t('dashboard.issue.issue_requests')}</StatsDt>
            <StatsDd>{totalSuccessfulIssueCount}</StatsDd>
          </>
        }
      />
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
