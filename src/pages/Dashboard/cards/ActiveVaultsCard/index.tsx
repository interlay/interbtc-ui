
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { VaultCountTimeData } from '@interlay/interbtc-index-client';

import LineChart from '../../LineChart';
import Stats, {
  StatsDt,
  StatsDd,
  StatsRouterLink
} from '../../Stats';
import DashboardCard from '../DashboardCard';
import ErrorFallback from 'components/ErrorFallback';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  INTERLAY_DENIM,
  KINTSUGI_SUNDOWN
} from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  hasLinks?: boolean;
}

const ActiveVaultsCard = ({ hasLinks }: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalVaultsPerDayIdle,
    isLoading: totalVaultsPerDayLoading,
    data: totalVaultsPerDay,
    error: totalVaultsPerDayError
  } = useQuery<Array<VaultCountTimeData>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getRecentDailyVaultCounts',
      {}
    ],
    genericFetcher<Array<VaultCountTimeData>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalVaultsPerDayError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (totalVaultsPerDayIdle || totalVaultsPerDayLoading) {
      return <>Loading...</>;
    }
    if (totalVaultsPerDay === undefined) {
      throw new Error('Something went wrong!');
    }

    let chartLineColor;
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      chartLineColor = INTERLAY_DENIM[500];
    // MEMO: should check dark mode as well
    } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      chartLineColor = KINTSUGI_SUNDOWN[500];
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>
                {t('dashboard.vault.active_vaults')}
              </StatsDt>
              <StatsDd>
                {totalVaultsPerDay[totalVaultsPerDay.length - 1]?.count}
              </StatsDd>
            </>
          }
          rightPart={
            <>
              {hasLinks && (
                <StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>
                  View vaults
                </StatsRouterLink>
              )}
            </>
          } />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_vaults_chart')]}
          yLabels={totalVaultsPerDay.map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[totalVaultsPerDay.map(dataPoint => dataPoint.count)]} />
      </>
    );
  };

  return (
    <DashboardCard>
      {renderContent()}
    </DashboardCard>
  );
};

export default withErrorBoundary(ActiveVaultsCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
