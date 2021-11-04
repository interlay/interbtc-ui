
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import Big from 'big.js';
import { BitcoinAmount } from '@interlay/monetary-js';

import DashboardCard from '../DashboardCard';
import Stats, {
  StatsDt,
  StatsDd,
  StatsRouterLink
} from '../../Stats';
import ErrorFallback from 'components/ErrorFallback';
import Ring64, {
  Ring64Title,
  Ring64Value
} from 'components/Ring64';
import {
  COLLATERAL_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from 'config/relay-chains';
import {
  displayMonetaryAmount,
  safeRoundTwoDecimals
} from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

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
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'getSystemCollateralization'
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded && !TEMP_COLLATERALIZATION_DISPLAY_DISABLED
    }
  );
  useErrorHandler(systemCollateralizationError);

  const {
    isIdle: issuableWrappedTokenIdle,
    isLoading: issuableWrappedTokenLoading,
    data: issuableWrappedToken,
    error: issuableWrappedTokenError
  } = useQuery<BitcoinAmount, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'getTotalIssuableAmount'
    ],
    genericFetcher<BitcoinAmount>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(issuableWrappedTokenError);

  const {
    isIdle: secureCollateralThresholdIdle,
    isLoading: secureCollateralThresholdLoading,
    data: secureCollateralThreshold,
    error: secureCollateralThresholdError
  } = useQuery<Big, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'vaults',
      'getSecureCollateralThreshold',
      COLLATERAL_TOKEN
    ],
    genericFetcher<Big>(),
    {
      enabled: !!bridgeLoaded && !TEMP_COLLATERALIZATION_DISPLAY_DISABLED
    }
  );
  useErrorHandler(secureCollateralThresholdError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (
      !TEMP_COLLATERALIZATION_DISPLAY_DISABLED &&
      (systemCollateralizationIdle || systemCollateralizationLoading)
    ) {
      return <>Loading...</>;
    }
    if (issuableWrappedTokenIdle || issuableWrappedTokenLoading) {
      return <>Loading...</>;
    }
    if (
      !TEMP_COLLATERALIZATION_DISPLAY_DISABLED &&
      (secureCollateralThresholdIdle || secureCollateralThresholdLoading)
    ) {
      return <>Loading...</>;
    }
    if (issuableWrappedToken === undefined) {
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
                  <StatsDt>
                    {t('dashboard.vault.collateralization')}
                  </StatsDt>
                  <StatsDd>
                    {safeRoundTwoDecimals(systemCollateralizationLabel)}%
                  </StatsDd>
                  <StatsDd>
                    {t('dashboard.vault.secure_threshold', {
                      threshold: safeRoundTwoDecimals(secureCollateralThresholdLabel)
                    })}
                  </StatsDd>
                </>
              )}
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
        <Ring64
          className={clsx(
            'mx-auto',
            // ray test touch <<
            'ring-interlayDenim'
            // ray test touch >>
          )}>
          <Ring64Title className='text-interlayDenim'>
            {t('dashboard.vault.capacity')}
          </Ring64Title>
          <Ring64Value>
            {`${displayMonetaryAmount(issuableWrappedToken)} ${WRAPPED_TOKEN_SYMBOL}`}
          </Ring64Value>
        </Ring64>
      </>
    );
  };

  return (
    <DashboardCard>
      {renderContent()}
    </DashboardCard>
  );
};

export default withErrorBoundary(CollateralizationCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
