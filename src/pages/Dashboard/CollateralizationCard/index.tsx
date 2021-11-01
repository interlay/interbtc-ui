
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import Big from 'big.js';
import { BitcoinAmount } from '@interlay/monetary-js';

import DashboardCard from 'pages/Dashboard/DashboardCard';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
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
  linkButton?: boolean;
}

const CollateralizationCard = ({ linkButton }: Props): JSX.Element => {
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
        <div
          className={clsx(
            'flex',
            'justify-between',
            'items-center'
          )}>
          <div>
            {!TEMP_COLLATERALIZATION_DISPLAY_DISABLED && (
              <>
                <h1
                  className={clsx(
                    // ray test touch <<
                    'text-interlayDenim',
                    // ray test touch >>
                    'text-sm',
                    'xl:text-base',
                    'mb-1',
                    'xl:mb-2'
                  )}>
                  {t('dashboard.vault.collateralization')}
                </h1>
                <h2
                  className={clsx(
                    'text-base',
                    'font-bold',
                    'mb-1'
                  )}>
                  {safeRoundTwoDecimals(systemCollateralizationLabel)}%
                </h2>
                <h2
                  className={clsx(
                    'text-base',
                    'font-bold',
                    'mb-1'
                  )}>
                  {t('dashboard.vault.secure_threshold', {
                    threshold: safeRoundTwoDecimals(secureCollateralThresholdLabel)
                  })}
                </h2>
              </>
            )}
          </div>
          {linkButton && (
            <InterlayRouterLink to={PAGES.DASHBOARD_VAULTS}>
              <InterlayDenimOutlinedButton
                endIcon={<FaExternalLinkAlt />}
                className='w-full'>
                VIEW VAULTS
              </InterlayDenimOutlinedButton>
            </InterlayRouterLink>
          )}
        </div>
        <div
          className={clsx(
            'mx-auto',
            'w-60',
            'h-60',
            'rounded-full',
            'flex',
            'justify-center',
            'items-center',
            'border-2',
            // ray test touch <<
            'border-interlayDenim'
            // ray test touch >>
          )}>
          <h1
            className={clsx(
              'font-bold',
              'text-2xl',
              // ray test touch <<
              'text-interlayDenim',
              // ray test touch >>
              'text-center'
            )}>
            <>
              <span className='inline-block'>
                {`${displayMonetaryAmount(issuableWrappedToken)} ${WRAPPED_TOKEN_SYMBOL}`}
              </span>
              <span className='inline-block'>{t('dashboard.vault.capacity')}</span>
            </>
          </h1>
        </div>
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
