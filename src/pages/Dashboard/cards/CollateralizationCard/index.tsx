import { IssueLimits } from '@interlay/interbtc-api/build/src/parachain/issue';
import Big from 'big.js';
import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { displayMonetaryAmount, safeRoundTwoDecimals } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import Ring64, { Ring64Title, Ring64Value } from '@/components/Ring64';
import { RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

const TEMP_COLLATERALIZATION_DISPLAY_DISABLED = true; // TODO: remove once lib reimplements collateralization

interface Props {
  hasLinks?: boolean;
}

const CollateralizationCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: systemCollateralizationIdle,
    isLoading: systemCollateralizationLoading,
    data: systemCollateralization,
    error: systemCollateralizationError
  } = useQuery<Big, Error>([GENERIC_FETCHER, 'vaults', 'getSystemCollateralization'], genericFetcher<Big>(), {
    enabled: !!bridgeLoaded && !TEMP_COLLATERALIZATION_DISPLAY_DISABLED
  });
  useErrorHandler(systemCollateralizationError);

  const {
    isIdle: requestLimitsIdle,
    isLoading: requestLimitsLoading,
    data: requestLimits,
    error: requestLimitsError
  } = useQuery<IssueLimits, Error>([GENERIC_FETCHER, 'issue', 'getRequestLimits'], genericFetcher<IssueLimits>(), {
    enabled: !!bridgeLoaded
  });
  useErrorHandler(requestLimitsError);

  const {
    isIdle: secureCollateralThresholdIdle,
    isLoading: secureCollateralThresholdLoading,
    data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [GENERIC_FETCHER, 'vaults', 'getSecureCollateralThreshold', RELAY_CHAIN_NATIVE_TOKEN],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded && !TEMP_COLLATERALIZATION_DISPLAY_DISABLED
    }
  );
  useErrorHandler(secureCollateralThresholdError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (!TEMP_COLLATERALIZATION_DISPLAY_DISABLED && (systemCollateralizationIdle || systemCollateralizationLoading)) {
      return <>Loading...</>;
    }
    if (requestLimitsIdle || requestLimitsLoading) {
      return <>Loading...</>;
    }
    if (
      !TEMP_COLLATERALIZATION_DISPLAY_DISABLED &&
      (secureCollateralThresholdIdle || secureCollateralThresholdLoading)
    ) {
      return <>Loading...</>;
    }
    if (requestLimits === undefined) {
      throw new Error('Something went wrong!');
    }

    const systemCollateralizationLabel = systemCollateralization?.mul(100).toString() || '0';
    const secureCollateralThresholdLabel = secureCollateralThreshold?.mul(100).toString() || '150';

    return (
      <>
        <Stats
          leftPart={
            <>
              {!TEMP_COLLATERALIZATION_DISPLAY_DISABLED && (
                <>
                  <StatsDt>{t('dashboard.vault.collateralization')}</StatsDt>
                  <StatsDd>{safeRoundTwoDecimals(systemCollateralizationLabel)}%</StatsDd>
                  <StatsDd>
                    {t('dashboard.vault.secure_threshold', {
                      threshold: safeRoundTwoDecimals(secureCollateralThresholdLabel)
                    })}
                  </StatsDd>
                </>
              )}
            </>
          }
          rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}</>}
        />
        <Ring64
          className={clsx(
            'mx-auto',
            { 'ring-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:ring-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          <Ring64Title
            className={clsx(
              { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {t('dashboard.vault.capacity')}
          </Ring64Title>
          <Ring64Value>
            {`${displayMonetaryAmount(requestLimits.totalMaxIssuable)} ${WRAPPED_TOKEN_SYMBOL}`}
          </Ring64Value>
        </Ring64>
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(CollateralizationCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
