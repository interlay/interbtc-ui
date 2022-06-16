import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import LineChart from '../../../LineChart';
import DashboardCard from '../../../cards/DashboardCard';
import Stats, { StatsDt, StatsDd, StatsRouterLink } from '../../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import { COUNT_OF_DATES_FOR_CHART } from 'config/general';
import { RELAY_CHAIN_NATIVE_TOKEN, GOVERNANCE_TOKEN, CollateralToken } from 'config/relay-chains';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
// ray test touch <
import { getUsdAmount, getLastMidnightTimestamps } from 'common/utils/utils';
// ray test touch >
import { StoreType } from 'common/types/util.types';
import useCumulativeCollateralVolumes from 'services/hooks/use-cumulative-collateral-volumes';

// ray test touch <
const cutoffTimestamps = getLastMidnightTimestamps(COUNT_OF_DATES_FOR_CHART, true);
// ray test touch >

const LockedCollateralsCard = (): JSX.Element => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  
  // ray test touch <
  const {
    isIdle: cumulativeRelayChainNativeTokenVolumesIdle,
    isLoading: cumulativeRelayChainNativeTokenVolumesLoading,
    data: cumulativeRelayChainNativeTokenVolumes,
    error: cumulativeRelayChainNativeTokenVolumesError
  } = useCumulativeCollateralVolumes(RELAY_CHAIN_NATIVE_TOKEN, cutoffTimestamps);
  useErrorHandler(cumulativeRelayChainNativeTokenVolumesError);

  const {
    isIdle: cumulativeGovernanceTokenVolumesIdle,
    isLoading: cumulativeGovernanceTokenVolumesLoading,
    data: cumulativeGovernanceTokenVolumes,
    error: cumulativeGovernanceTokenVolumesError
  } = useCumulativeCollateralVolumes(GOVERNANCE_TOKEN as CollateralToken, cutoffTimestamps);
  useErrorHandler(cumulativeGovernanceTokenVolumesError);
  // ray test touch >

  // ray test touch <
  const relayChainNativeTokenPriceInUSD = prices.collateralToken?.usd;
  const governanceTokenPriceInUSD = prices.governanceToken?.usd;
  if (
    
    relayChainNativeTokenPriceInUSD === undefined ||
    governanceTokenPriceInUSD === undefined
  ) {
    throw new Error('Something went wrong with price feeds!');
  }

  const cumulativeUSDVolumes = React.useMemo(() => {
    if (
      cumulativeRelayChainNativeTokenVolumes === undefined ||
      cumulativeGovernanceTokenVolumes === undefined
    ) return;

    return Array<number>(COUNT_OF_DATES_FOR_CHART).fill(0).map((_, index) => {
      // TODO: could be better
      const relayChainNativeTokenItem = cumulativeRelayChainNativeTokenVolumes[index];
      const governanceTokenItem = cumulativeGovernanceTokenVolumes[index];

      // TODO: using `Number` against the return of `getUsdAmount` is error-prone because `getUsdAmount` returns "-" in the case of undefined `rate`
      const relayChainNativeTokenItemValueInUSD = Number(getUsdAmount(relayChainNativeTokenItem.amount, relayChainNativeTokenPriceInUSD));
      const governanceTokenItemValueInUSD = Number(getUsdAmount(governanceTokenItem.amount, governanceTokenPriceInUSD));

      const sumValueInUSD =
        relayChainNativeTokenItemValueInUSD +
        governanceTokenItemValueInUSD;

      return {
        sumValueInUSD,
        tillTimestamp: cutoffTimestamps[index]
      };
    })
  }, [
    cumulativeRelayChainNativeTokenVolumes,
    cumulativeGovernanceTokenVolumes,
    relayChainNativeTokenPriceInUSD,
    governanceTokenPriceInUSD
  ]);
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

    // ray test touch <
    if (cumulativeUSDVolumes === undefined) {
      throw new Error('Something went wrong with cumulativeUSDVolumes!');
    }
    // ray test touch >
    

    // ray test touch <
    console.log('ray : ***** cumulativeRelayChainNativeTokenVolumes => ', cumulativeRelayChainNativeTokenVolumes);
    console.log('ray : ***** cutoffTimestamps => ', cutoffTimestamps);
    console.log('ray : ***** cumulativeUSDVolumes => ', cumulativeUSDVolumes);
    // ray test touch >

    // ray test touch <
    const totalLockedCollateralValueInUSD = cumulativeUSDVolumes.slice(-1)[0].sumValueInUSD;
    // ray test touch >

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
              <StatsDd>${totalLockedCollateralValueInUSD}</StatsDd>
            </>
          }
          rightPart={<StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_collateral_locked')]}
          yLabels={
            // ray test touch <
            cumulativeUSDVolumes
              .slice(0, -1)
              .map((item) => item.tillTimestamp.toISOString().substring(0, 10))
            // ray test touch >
          }
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[
            // ray test touch <
            cumulativeUSDVolumes.slice(1).map((item) => item.sumValueInUSD)
            // ray test touch >
          ]}
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