import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { convertMonetaryAmountToValueInUSD, formatUSD, getLastMidnightTimestamps } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import { COUNT_OF_DATES_FOR_CHART } from '@/config/charts';
import {
  CollateralToken,
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL
} from '@/config/relay-chains';
import useCumulativeCollateralVolumes from '@/services/hooks/use-cumulative-collateral-volumes';
import { INTERLAY_DENIM, KINTSUGI_SUPERNOVA } from '@/utils/constants/colors';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import DashboardCard from '../../../cards/DashboardCard';
import LineChart from '../../../LineChart';
import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../../Stats';

const cutoffTimestamps = getLastMidnightTimestamps(COUNT_OF_DATES_FOR_CHART, true);

const LockedCollateralsCard = (): JSX.Element => {
  const { t } = useTranslation();
  const prices = useGetPrices();

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

  const relayChainNativeTokenPriceInUSD = getTokenPrice(prices, RELAY_CHAIN_NATIVE_TOKEN_SYMBOL)?.usd;
  const governanceTokenPriceInUSD = getTokenPrice(prices, GOVERNANCE_TOKEN_SYMBOL)?.usd;

  const cumulativeUSDVolumes = React.useMemo(() => {
    if (cumulativeRelayChainNativeTokenVolumes === undefined || cumulativeGovernanceTokenVolumes === undefined) return;

    return Array<number>(COUNT_OF_DATES_FOR_CHART)
      .fill(0)
      .map((_, index) => {
        const collaterals = [
          {
            cumulativeVolumes: cumulativeRelayChainNativeTokenVolumes,
            tokenPriceInUSD: relayChainNativeTokenPriceInUSD
          }
        ];

        // Includes governance token data only if the price is available.
        if (governanceTokenPriceInUSD !== undefined) {
          collaterals.push({
            cumulativeVolumes: cumulativeGovernanceTokenVolumes,
            tokenPriceInUSD: governanceTokenPriceInUSD
          });
        }

        let sumValueInUSD = 0;
        for (const collateral of collaterals) {
          // ray test touch <
          sumValueInUSD +=
            convertMonetaryAmountToValueInUSD(collateral.cumulativeVolumes[index].amount, collateral.tokenPriceInUSD) ??
            0;
          // ray test touch >
        }

        return {
          sumValueInUSD,
          tillTimestamp: cutoffTimestamps[index]
        };
      });
  }, [
    cumulativeRelayChainNativeTokenVolumes,
    cumulativeGovernanceTokenVolumes,
    relayChainNativeTokenPriceInUSD,
    governanceTokenPriceInUSD
  ]);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (
      cumulativeRelayChainNativeTokenVolumesIdle ||
      cumulativeRelayChainNativeTokenVolumesLoading ||
      cumulativeGovernanceTokenVolumesIdle ||
      cumulativeGovernanceTokenVolumesLoading
    ) {
      return <>Loading...</>;
    }

    if (cumulativeUSDVolumes === undefined) {
      throw new Error('Something went wrong with cumulativeUSDVolumes!');
    }

    // ray test touch <
    const totalLockedCollateralValueInUSDLabel = formatUSD(cumulativeUSDVolumes.slice(-1)[0].sumValueInUSD);
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
              <StatsDt>{t('dashboard.vault.total_collateral_locked_usd')}</StatsDt>
              {/* ray test touch < */}
              <StatsDd>{totalLockedCollateralValueInUSDLabel}</StatsDd>
              {/* ray test touch > */}
            </>
          }
          rightPart={<StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_collateral_locked_usd')]}
          yLabels={cumulativeUSDVolumes.slice(0, -1).map((item) => item.tillTimestamp.toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[cumulativeUSDVolumes.slice(1).map((item) => item.sumValueInUSD)]}
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
