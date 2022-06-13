import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import LineChart from '../../../LineChart';
import DashboardCard from '../../../cards/DashboardCard';
import Stats, { StatsDt, StatsDd, StatsRouterLink } from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { RELAY_CHAIN_NATIVE_TOKEN_SYMBOL, RELAY_CHAIN_NATIVE_TOKEN, GOVERNANCE_TOKEN, CollateralToken } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
import { getUsdAmount, displayMonetaryAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import useCumulativeCollateralVolumes from 'services/hooks/use-cumulative-collateral-volumes';

const LockedCollateralsCard = (): JSX.Element => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  // ray test touch <
  const {
    isIdle: cumulativeRelayChainNativeTokenVolumesIdle,
    isLoading: cumulativeRelayChainNativeTokenVolumesLoading,
    data: cumulativeRelayChainNativeTokenVolumes,
    error: cumulativeRelayChainNativeTokenVolumesError
  } = useCumulativeCollateralVolumes(RELAY_CHAIN_NATIVE_TOKEN);
  useErrorHandler(cumulativeRelayChainNativeTokenVolumesError);

  const {
    isIdle: cumulativeGovernanceTokenVolumesIdle,
    isLoading: cumulativeGovernanceTokenVolumesLoading,
    data: cumulativeGovernanceTokenVolumes,
    error: cumulativeGovernanceTokenVolumesError
  } = useCumulativeCollateralVolumes(GOVERNANCE_TOKEN as CollateralToken);
  useErrorHandler(cumulativeGovernanceTokenVolumesError);
  // ray test touch >

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (
      cumulativeRelayChainNativeTokenVolumesIdle ||
      cumulativeRelayChainNativeTokenVolumesLoading ||
      // ray test touch <
      cumulativeGovernanceTokenVolumesIdle ||
      cumulativeGovernanceTokenVolumesLoading
      // ray test touch >
    ) {
      return <>Loading...</>;
    }
    if (
      cumulativeRelayChainNativeTokenVolumes === undefined ||
      // ray test touch <
      cumulativeGovernanceTokenVolumes === undefined
      // ray test touch >
    ) {
      throw new Error('Something went wrong!');
    }
    const totalLockedCollateralTokenAmount = cumulativeRelayChainNativeTokenVolumes.slice(-1)[0].amount;

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
          yLabels={cumulativeRelayChainNativeTokenVolumes
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
          datasets={[cumulativeRelayChainNativeTokenVolumes.slice(1).map((dataPoint) => displayMonetaryAmount(dataPoint.amount))]}
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