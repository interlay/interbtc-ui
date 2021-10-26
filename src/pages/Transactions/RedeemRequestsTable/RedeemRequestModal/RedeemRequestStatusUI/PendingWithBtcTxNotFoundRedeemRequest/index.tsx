
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Redeem } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import Timer from 'components/Timer';
import { BLOCK_TIME } from 'config/parachain';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { StoreType } from 'common/types/util.types';

interface Props {
  request: Redeem;
}

const PendingWithBtcTxNotFoundRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!request) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const redeemPeriod = await window.bridge.interBtcApi.redeem.getRedeemPeriod();
        const requestTimestamp = Math.floor(new Date(Number(request.creationTimestamp)).getTime() / 1000);
        const theInitialLeftSeconds = requestTimestamp + (redeemPeriod * BLOCK_TIME) - Math.floor(Date.now() / 1000);
        setInitialLeftSeconds(theInitialLeftSeconds);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[PendingWithBtcTxNotFoundRedeemRequest useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    bridgeLoaded
  ]);

  return (
    <RequestWrapper>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium'
        )}>
        {t('pending')}
      </h2>
      <p
        className={clsx(
          'flex',
          'justify-between',
          'items-center',
          'space-x-1'
        )}>
        <span
          className={clsx(
            { 'text-interlaySecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
            { 'dark:text-kintsugiSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'flex-1'
          )}>
          {t('redeem_page.vault_has_time_to_complete')}
        </span>
        {initialLeftSeconds && (
          <Timer
            initialLeftSeconds={initialLeftSeconds}
            className={clsx(
              'flex-shrink-0',
              'flex-1',
              'text-center'
            )} />
        )}
      </p>
      <div
        className={clsx(
          'w-48',
          'h-48',
          'ring-4',
          'ring-interlayPaleSky',
          'rounded-full',
          'inline-flex',
          'flex-col',
          'items-center',
          'justify-center'
        )}>
        <span
          className={clsx(
            'mt-4',
            'text-2xl',
            'font-medium'
          )}>
          {t('redeem_page.waiting_for')}
        </span>
        <span
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          {t('nav_vault')}
        </span>
      </div>
    </RequestWrapper>
  );
};

export default PendingWithBtcTxNotFoundRedeemRequest;
