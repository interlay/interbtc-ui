import { ReactElement, useState, useEffect } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboardcolors';
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
  const statusColor = state === Status.Loading ? 'd_grey' : state === Status.Ok ? 'd_green' : 'd_red';

  useEffect(() => {
    (async () => {
      try {
        const hash = await window.interBTC.electrsAPI.getLatestBlock();
        setBlockstreamTip(hash);
      } catch (e) {
        console.log(e);
      }
    })();
  });

  return (
    <>
      <DashboardCard>
        <div className='card-top-content'>
          <div className='values-container'>
            <h1 className='font-bold'>
              {t('dashboard.relay.relay_is')}&nbsp;
              <span
                style={{ color: getAccents(statusColor).color }}
                id='relay-text'
                className='font-bold'>
                {statusText}
              </span>
            </h1>
          </div>
          {linkButton && (
            <div className='button-container'>
              <ButtonComponent
                buttonName='view BTC Relay'
                propsButtonColor='d_green'
                buttonId='btc-relay'
                buttonLink={PAGES.relay} />
            </div>
          )}
        </div>
        <div className='circle-container'>
          <div
            className='status-circle'
            style={{ borderColor: getAccents(statusColor).color }}
            id='relay-circle'>
            <h1
              className={clsx(
                'h1-xl',
                'text-3xl',
                'text-center'
              )}
              style={{ color: getAccents(statusColor).color }}
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
          <div className='card-top-content'>
            <div className='values-container'>
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
              className='status-circle border-interlayDodgerBlue'
              id='relay-circle'>
              <h1
                className={clsx(
                  'h1-xl',
                  'text-3xl',
                  'text-interlayDodgerBlue',
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
