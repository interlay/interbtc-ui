import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { CollateralUnit } from '@interlay/interbtc-api';

import LineChart from '../../LineChart';
import DashboardCard from '../DashboardCard';
import Stats, { StatsDt, StatsDd, StatsRouterLink } from '../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { RELAY_CHAIN_NATIVE_TOKEN_SYMBOL, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
import { getUsdAmount, displayMonetaryAmount, getLastMidnightTimestamps } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from 'services/fetchers/cumulative-volumes-till-timestamps-fetcher';

interface Props {
  hasLinks?: boolean;
}

// Get 6 values to be able to calculate difference between 5 days ago and 6 days ago,
// thus issues per day 5 days ago can be displayed,
// cumulative issues are also only displayed to 5 days.
const cutoffTimestamps = getLastMidnightTimestamps(6, true);

const CollateralLockedCard = ({ hasLinks }: Props): JSX.Element => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: cumulativeCollateralPerDayIdle,
    isLoading: cumulativeCollateralPerDayLoading,
    data: cumulativeCollateralPerDay,
    error: cumulativeCollateralPerDayError
    // TODO: should type properly (`Relay`)
  } = useQuery<VolumeDataPoint<CollateralUnit>[], Error>(
    [
      CUMULATIVE_VOLUMES_FETCHER,
      'Collateral' as VolumeType,
      cutoffTimestamps,
      RELAY_CHAIN_NATIVE_TOKEN, // returned amounts
      RELAY_CHAIN_NATIVE_TOKEN, // filter by this collateral...
      WRAPPED_TOKEN //     and this backing currency
    ],
    cumulativeVolumesFetcher
  );
  useErrorHandler(cumulativeCollateralPerDayError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeCollateralPerDayIdle || cumulativeCollateralPerDayLoading) {
      return <>Loading...</>;
    }
    if (cumulativeCollateralPerDay === undefined) {
      throw new Error('Something went wrong!');
    }
    const totalLockedCollateralTokenAmount = cumulativeCollateralPerDay.slice(-1)[0].amount;

    let chartLineColor;
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      chartLineColor = INTERLAY_DENIM[500];
      // MEMO: should check dark mode as well
    } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      chartLineColor = KINTSUGI_SUPERNOVA[500];
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>{t('dashboard.vault.locked_collateral')}</StatsDt>
              <StatsDd>
                {displayMonetaryAmount(totalLockedCollateralTokenAmount)} {RELAY_CHAIN_NATIVE_TOKEN_SYMBOL}
              </StatsDd>
              <StatsDd>${getUsdAmount(totalLockedCollateralTokenAmount, prices.collateralToken?.usd)}</StatsDd>
            </>
          }
          rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}</>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_collateral_locked')]}
          yLabels={cumulativeCollateralPerDay
            .slice(0, -1)
            .map((dataPoint) => dataPoint.tillTimestamp.toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[cumulativeCollateralPerDay.slice(1).map((dataPoint) => displayMonetaryAmount(dataPoint.amount))]}
        />
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(CollateralLockedCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
