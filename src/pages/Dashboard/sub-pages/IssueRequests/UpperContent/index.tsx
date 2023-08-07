import { newMonetaryAmount } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import Panel from '@/legacy-components/Panel';
import IssuedChart from '@/pages/Dashboard/IssuedChart';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { issuesCountQuery } from '@/services/queries/issues';
import { ForeignAssetIdLiteral } from '@/types/currency';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetTotalLockedTokens } from '@/utils/hooks/api/tokens/use-get-total-locked-tokens';

import Stats, { StatsDd, StatsDt } from '../../../Stats';

const UpperContent = (): JSX.Element => {
  const { data: totalLockedData } = useGetTotalLockedTokens();
  const { t } = useTranslation();
  const prices = useGetPrices();

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssues,
    error: totalSuccessfulIssuesError
    // TODO: should type properly (`Relay`)
  } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, issuesCountQuery('status_eq: Completed')],
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
                amount: totalLockedData?.wrapped.toHuman(8) || 0,
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </StatsDd>
            <StatsDd>
              {displayMonetaryAmountInUSDFormat(
                totalLockedData?.relay || newMonetaryAmount(0, WRAPPED_TOKEN),
                getTokenPrice(prices, ForeignAssetIdLiteral.BTC)?.usd
              )}
            </StatsDd>
            <StatsDt className={`!${getColorShade('green')}`}>{t('dashboard.issue.issue_requests')}</StatsDt>
            <StatsDd>{formatNumber(totalSuccessfulIssueCount)}</StatsDd>
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
