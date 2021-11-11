
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';

import DashboardCard from '../../../cards/DashboardCard';
import Stats from '../../../Stats';
import ExternalLink from 'components/ExternalLink';
import ErrorFallback from 'components/ErrorFallback';
import Ring64, {
  Ring64Title,
  Ring64Value
} from 'components/Ring64';
import { BTC_BLOCK_API } from 'config/bitcoin';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const BlockstreamCard = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    bridgeLoaded,
    bitcoinHeight
  } = useSelector((state: StoreType) => state.general);

  const {
    isIdle: blockstreamTipIdle,
    isLoading: blockstreamTipLoading,
    data: blockstreamTip,
    error: blockstreamTipError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      'interBtcApi',
      'electrsAPI',
      'getLatestBlock'
    ],
    genericFetcher<string>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(blockstreamTipError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (blockstreamTipIdle || blockstreamTipLoading) {
      return <>Loading...</>;
    }

    return (
      <>
        <Stats
          rightPart={
            <>
              <ExternalLink
                href={`${BTC_BLOCK_API}${blockstreamTip}`}
                className={clsx(
                  'text-sm',
                  'font-medium'
                )}>
                {t('dashboard.relay.blockstream_verify_link')}
              </ExternalLink>
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
            {t('blockstream')}
          </Ring64Title>
          <Ring64Value>
            {t('dashboard.relay.block_number', { number: bitcoinHeight })}
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

export default withErrorBoundary(BlockstreamCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
