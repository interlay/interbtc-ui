import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import Timer from 'components/Timer';
import Ring48, { Ring48Title, Ring48Value } from 'components/Ring48';
import { BLOCK_TIME } from 'config/parachain';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { StoreType } from 'common/types/util.types';

interface Props {
  // TODO: should type properly (`Relay`)
  redeem: any;
}

const PendingWithBtcTxNotFoundRedeemRequest = ({ redeem }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const [initialLeftSeconds, setInitialLeftSeconds] = React.useState<number>();

  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!redeem) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const [redeemPeriodInBlocks, requestById] = await Promise.all([
          window.bridge.redeem.getRedeemPeriod(),
          window.bridge.redeem.getRequestById(redeem.id)
        ]);

        const maxRedeemPeriodInBlocks = Math.max(redeemPeriodInBlocks, requestById.period);
        const requestTimestamp = Math.floor(new Date(redeem.request.timestamp).getTime() / 1000);
        const theInitialLeftSeconds =
          requestTimestamp + maxRedeemPeriodInBlocks * BLOCK_TIME - Math.floor(Date.now() / 1000);
        setInitialLeftSeconds(theInitialLeftSeconds);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[PendingWithBtcTxNotFoundRedeemRequest useEffect] error.message => ', error.message);
      }
    })();
  }, [redeem, bridgeLoaded]);

  return (
    <RequestWrapper>
      <h2 className={clsx('text-3xl', 'font-medium')}>{t('pending')}</h2>
      <p className={clsx('grid', 'grid-cols-2', 'items-center', 'gap-1')}>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'flex-1'
          )}
        >
          {t('redeem_page.vault_has_time_to_complete')}
        </span>
        {initialLeftSeconds && (
          <Timer initialLeftSeconds={initialLeftSeconds} className={clsx('flex-shrink-0', 'flex-1', 'text-center')} />
        )}
      </p>
      <Ring48 className='ring-interlayPaleSky'>
        <Ring48Title>{t('redeem_page.waiting_for')}</Ring48Title>
        <Ring48Value>{t('nav_vaults')}</Ring48Value>
      </Ring48>
    </RequestWrapper>
  );
};

export default PendingWithBtcTxNotFoundRedeemRequest;
