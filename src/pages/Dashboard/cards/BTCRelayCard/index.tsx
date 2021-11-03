
import * as React from 'react';
import { useSelector } from 'react-redux';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import DashboardCard from '../DashboardCard';
import ExternalLink from 'components/ExternalLink';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { BTC_BLOCK_API } from 'config/bitcoin';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

enum Status {
  Loading,
  Ok,
  Failure
}

interface Props {
  linkButton?: boolean;
  displayBlockstreamData?: boolean;
}

const BTCRelayCard = ({
  linkButton,
  displayBlockstreamData
}: Props): JSX.Element => {
  const { t } = useTranslation();
  // TODO: compute status using blockstream data
  const { btcRelayHeight, bitcoinHeight, bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const [blockstreamTip, setBlockstreamTip] = React.useState('-');

  const outdatedRelayThreshold = 12;
  const state =
        bitcoinHeight === 0 ?
          Status.Loading :
          bitcoinHeight - btcRelayHeight >= outdatedRelayThreshold ?
            Status.Failure :
            Status.Ok;
  const statusText =
        state === Status.Loading ?
          t('loading') :
          state === Status.Ok ?
            t('dashboard.synchronized') :
            t('dashboard.not_synchronized');
  const graphText =
        state === Status.Loading ?
          t('loading') :
          state === Status.Ok ?
            t('dashboard.synced') :
            t('dashboard.out_of_sync');

  React.useEffect(() => {
    (async () => {
      if (!bridgeLoaded) return;
      try {
        const hash = await window.bridge.interBtcApi.electrsAPI.getLatestBlock();
        setBlockstreamTip(hash);
      } catch (error) {
        console.log('[BtcRelay] error.message => ', error.message);
      }
    })();
  }, [bridgeLoaded]);

  return (
    <>
      <DashboardCard>
        <div
          className={clsx(
            'flex',
            'justify-between',
            'items-center'
          )}>
          <div>
            <h1
              className={clsx(
                'font-bold',
                'text-sm',
                'xl:text-base',
                'mb-1',
                'xl:mb-2'
              )}>
              {t('dashboard.relay.relay_is')}&nbsp;
              <span
                id='relay-text'
                className={clsx(
                  'font-bold',
                  { 'text-interlayPaleSky': state === Status.Loading },
                  { 'text-interlayConifer': state === Status.Ok },
                  { 'text-interlayCinnabar': state !== Status.Loading && state !== Status.Ok }
                )}>
                {statusText}
              </span>
            </h1>
          </div>
          {linkButton && (
            <InterlayRouterLink to={PAGES.DASHBOARD_RELAY}>
              <InterlayConiferOutlinedButton
                endIcon={<FaExternalLinkAlt />}
                className='w-full'>
                VIEW BTC RELAY
              </InterlayConiferOutlinedButton>
            </InterlayRouterLink>
          )}
        </div>
        <div className='mt-6 flex justify-center items-center'>
          <div
            className={clsx(
              'w-64',
              'h-64',
              'ring-4',
              'rounded-full',
              'inline-flex',
              'flex-col',
              'items-center',
              'justify-center',

              { 'ring-interlayPaleSky': state === Status.Loading },
              { 'ring-interlayConifer': state === Status.Ok },
              { 'ring-interlayCinnabar': state !== Status.Loading && state !== Status.Ok }
            )}
            id='relay-circle'>
            <h1
              className={clsx(
                'font-bold',
                'text-3xl',
                'text-center',
                { 'text-interlayPaleSky': state === Status.Loading },
                { 'text-interlayConifer': state === Status.Ok },
                { 'text-interlayCinnabar': state !== Status.Loading && state !== Status.Ok }
              )}>
              {graphText}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {t('dashboard.relay.block_number', { number: btcRelayHeight })}
            </h2>
          </div>
        </div>
      </DashboardCard>
      {displayBlockstreamData && (
        <DashboardCard>
          <div
            className={clsx(
              'flex',
              'justify-between',
              'items-center'
            )}>
            <div>
              <h1
                className={clsx(
                  'font-bold',
                  'text-sm',
                  'xl:text-base',
                  'mb-1',
                  'xl:mb-2'
                )}>
                {blockstreamTip !== '-' && (
                  <ExternalLink href={`${BTC_BLOCK_API}${blockstreamTip}`}>
                    {t('dashboard.relay.blockstream_verify_link')}
                  </ExternalLink>
                )}
              </h1>
            </div>
          </div>
          <div
            className={clsx(
              'mt-6',
              'flex',
              'justify-center',
              'items-center'
            )}>
            <div
              className={clsx(
                'w-64',
                'h-64',
                'ring-4',
                // ray test touch <<
                'ring-interlayDenim',
                // ray test touch >>
                'rounded-full',
                'inline-flex',
                'flex-col',
                'items-center',
                'justify-center'
              )}
              id='relay-circle'>
              <h1
                className={clsx(
                  'font-bold',
                  'text-3xl',
                  // ray test touch <<
                  'text-interlayDenim',
                  // ray test touch >>
                  'text-center'
                )}>
                {t('blockstream')}
              </h1>
              <h2
                className={clsx(
                  'text-base',
                  'font-bold',
                  'mb-1'
                )}>
                {t('dashboard.relay.block_number', { number: bitcoinHeight })}
              </h2>
            </div>
          </div>
        </DashboardCard>
      )}
    </>
  );
};

export default BTCRelayCard;
