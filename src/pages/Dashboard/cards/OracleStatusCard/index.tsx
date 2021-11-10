
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { CollateralBtcOracleStatus } from '@interlay/interbtc/build/oracleTypes';

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
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  hasLinks?: boolean;
}

const OracleStatusCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: collateralBtcOracleStatusIdle,
    isLoading: collateralBtcOracleStatusLoading,
    data: collateralBtcOracleStatus,
    error: collateralBtcOracleStatusError
  } = useQuery<CollateralBtcOracleStatus, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getLatestSubmission',
      COLLATERAL_TOKEN_SYMBOL
    ],
    genericFetcher<CollateralBtcOracleStatus>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(collateralBtcOracleStatusError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (collateralBtcOracleStatusIdle || collateralBtcOracleStatusLoading) {
      return <>Loading...</>;
    }
    if (collateralBtcOracleStatus === undefined) {
      throw new Error('Something went wrong!');
    }

    const exchangeRate = collateralBtcOracleStatus.exchangeRate;
    const oracleStatus = collateralBtcOracleStatus.online;

    let statusText;
    let statusCircleText;
    if (oracleStatus === true) {
      statusText = t('dashboard.oracles.online');
      statusCircleText = t('online');
    } else if (oracleStatus === false) {
      statusText = t('dashboard.oracles.offline');
      statusCircleText = t('offline');
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>
                {t('dashboard.oracles.oracles_are')}
              </StatsDt>
              <StatsDd
                className={clsx(
                  { 'text-interlayConifer': oracleStatus === true },
                  { 'text-interlayCinnabar': oracleStatus === false }
                )}>
                {statusText}
              </StatsDd>
            </>
          }
          rightPart={
            <>
              {hasLinks && (
                <StatsRouterLink to={PAGES.DASHBOARD_ORACLES}>
                  View oracles
                </StatsRouterLink>
              )}
            </>
          } />
        <Ring64
          className={clsx(
            'mx-auto',
            { 'ring-interlayConifer': oracleStatus === true },
            { 'ring-interlayCinnabar': oracleStatus === false }
          )}>
          <Ring64Title
            className={clsx(
              { 'text-interlayConifer': oracleStatus === true },
              { 'text-interlayCinnabar': oracleStatus === false }
            )}>
            {statusCircleText}
          </Ring64Title>
          <Ring64Value>
            {exchangeRate.toHuman(5)} {COLLATERAL_TOKEN_SYMBOL}/BTC
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

export default withErrorBoundary(OracleStatusCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
