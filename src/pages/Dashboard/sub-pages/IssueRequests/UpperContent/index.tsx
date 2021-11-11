
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
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const UpperContent = (): JSX.Element => {
  const {
    totalWrappedTokenAmount,
    prices,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssues,
    error: totalSuccessfulIssuesError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalSuccessfulIssues'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalSuccessfulIssuesError);

  // TODO: should use skeleton loaders
  if (totalSuccessfulIssuesIdle || totalSuccessfulIssuesLoading) {
    return <>Loading...</>;
  }

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
            <StatsDt
              className={clsx(
                { '!text-interlayDenim':
                  process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
                { 'dark:!text-kintsugiMidnight':
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
