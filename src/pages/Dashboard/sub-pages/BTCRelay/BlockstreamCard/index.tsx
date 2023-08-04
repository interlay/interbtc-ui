import clsx from 'clsx';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { formatNumber } from '@/common/utils/utils';
import { BTC_EXPLORER_BLOCK_API } from '@/config/blockstream-explorer-links';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import ExternalLink from '@/legacy-components/ExternalLink';
import Ring64, { Ring64Title, Ring64Value } from '@/legacy-components/Ring64';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { useGetBtcBlockHeight } from '@/utils/hooks/api/use-get-btc-block-height';

import DashboardCard from '../../../cards/DashboardCard';
import Stats from '../../../Stats';

const BlockstreamCard = (): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: blockHeight } = useGetBtcBlockHeight();

  const {
    isIdle: blockstreamTipIdle,
    isLoading: blockstreamTipLoading,
    data: blockstreamTip,
    error: blockstreamTipError
  } = useQuery<string, Error>([GENERIC_FETCHER, 'electrsAPI', 'getLatestBlock'], genericFetcher<string>(), {
    enabled: !!bridgeLoaded
  });
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
                href={`${BTC_EXPLORER_BLOCK_API}${blockstreamTip}`}
                className={clsx('text-sm', 'font-medium')}
              >
                {t('dashboard.relay.blockstream_verify_link')}
              </ExternalLink>
            </>
          }
        />
        <Ring64
          className={clsx(
            'mx-auto',
            { 'ring-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:ring-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          <Ring64Title
            className={clsx(
              { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {t('blockstream')}
          </Ring64Title>
          <Ring64Value>
            {t('dashboard.relay.block_number', { number: formatNumber(blockHeight?.bitcoin || 0) })}
          </Ring64Value>
        </Ring64>
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(BlockstreamCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
