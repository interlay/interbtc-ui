
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Redeem } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import Ring48, {
  Ring48Title,
  Ring48Value
} from 'components/Ring48';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';

interface Props {
  request: Redeem;
}

const DefaultRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);

  React.useEffect(() => {
    if (!bridgeLoaded) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const theStableBitcoinConfirmations =
          await window.bridge.interBtcApi.btcRelay.getStableBitcoinConfirmations();

        setStableBitcoinConfirmations(theStableBitcoinConfirmations);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RedeemRequestStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [bridgeLoaded]);

  return (
    <RequestWrapper>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium'
        )}>
        {t('received')}
      </h2>
      <Ring48 className='ring-interlayCalifornia'>
        <Ring48Title>
          {t('redeem_page.waiting_for')}
        </Ring48Title>
        <Ring48Title>
          {t('confirmations')}
        </Ring48Title>
        <Ring48Value className='text-interlayConifer'>
          {`${request.confirmations}/${stableBitcoinConfirmations}`}
        </Ring48Value>
      </Ring48>
      <p className='space-x-1'>
        <span
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {t('issue_page.btc_transaction')}:
        </span>
        <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
      </p>
    </RequestWrapper>
  );
};

export default DefaultRedeemRequest;
