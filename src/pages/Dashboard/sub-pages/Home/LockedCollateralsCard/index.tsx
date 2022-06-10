import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import LineChart from '../../../LineChart';
import DashboardCard from '../../../cards/DashboardCard';
import Stats, { StatsDt, StatsDd, StatsRouterLink } from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { RELAY_CHAIN_NATIVE_TOKEN_SYMBOL, RELAY_CHAIN_NATIVE_TOKEN } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
import { getUsdAmount, displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
// ray test touch <
import useCumulativeCollateralVolumes from 'services/hooks/use-cumulative-collateral-volumes';
// ray test touch >

const LockedCollateralsCard = (): JSX.Element => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  // ray test touch <
  const {
    isIdle: cumulativeVolumesIdle,
    isLoading: cumulativeVolumesLoading,
    data: cumulativeVolumes,
    error: cumulativeVolumesError
  } = useCumulativeCollateralVolumes(RELAY_CHAIN_NATIVE_TOKEN);
  useErrorHandler(cumulativeVolumesError);
  // ray test touch >

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeVolumesIdle || cumulativeVolumesLoading) {
      return <>Loading...</>;
    }
    if (cumulativeVolumes === undefined) {
      throw new Error('Something went wrong!');
    }
    const totalLockedCollateralTokenAmount = cumulativeVolumes.slice(-1)[0].amount;

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
          rightPart={<StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_collateral_locked')]}
          yLabels={cumulativeVolumes
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
          datasets={[cumulativeVolumes.slice(1).map((dataPoint) => displayMonetaryAmount(dataPoint.amount))]}
        />
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(LockedCollateralsCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});