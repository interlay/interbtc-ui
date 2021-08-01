import { ReactElement, useState, useEffect } from 'react';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayConiferOutlinedButton from 'components/buttons/InterlayConiferOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { StyledLinkData } from '../../../common/components/dashboard-table/dashboard-table';
import { BTC_BLOCK_API } from 'config/bitcoin';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import clsx from 'clsx';

enum Status {
  Loading,
  Ok,
  Failure
}

type BtcRelayProps = {
  linkButton?: boolean;
  displayBlockstreamData?: boolean;
};

const BtcRelay = ({ linkButton, displayBlockstreamData }: BtcRelayProps): ReactElement => {
  const { t } = useTranslation();
  // TODO: Compute status using blockstream data
  const { btcRelayHeight, bitcoinHeight } = useSelector((state: StoreType) => state.general);
  const [blockstreamTip, setBlockstreamTip] = useState('-');
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

  useEffect(() => {
    (async () => {
      try {
        const hash = await window.polkaBTC.electrsAPI.getLatestBlock();
        setBlockstreamTip(hash);
      } catch (e) {
        console.log(e);
      }
    })();
  });

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
            <h1 className='font-bold'>
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
        <div className='circle-container'>
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
                'h1-xl',
                'text-3xl',
                'text-center',
                { 'text-interlayPaleSky': state === Status.Loading },
                { 'text-interlayConifer': state === Status.Ok },
                { 'text-interlayCinnabar': state !== Status.Loading && state !== Status.Ok }
              )}
              id='relay-circle-text'>
              {graphText}
            </h1>
            <h2>
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
              <h1 className='font-bold'>
                {blockstreamTip !== '-' && (
                  <StyledLinkData
                    data={t('dashboard.relay.blockstream_verify_link')}
                    target={BTC_BLOCK_API + blockstreamTip}
                    newTab={true} />
                )}
              </h1>
            </div>
          </div>
          <div className='circle-container'>
            <div
              className={clsx(
                'w-64',
                'h-64',
                'ring-4',
                'ring-interlayDenim',
                'rounded-full',
                'inline-flex',
                'flex-col',
                'items-center',
                'justify-center'
              )}
              id='relay-circle'>
              <h1
                className={clsx(
                  'h1-xl',
                  'text-3xl',
                  'text-interlayDenim',
                  'text-center'
                )}
                id='relay-circle-text'>
                {t('blockstream')}
              </h1>
              <h2>
                {t('dashboard.relay.block_number', { number: bitcoinHeight })}
              </h2>
            </div>
          </div>
        </DashboardCard>
      )}
    </>
  );
};

export default BtcRelay;
