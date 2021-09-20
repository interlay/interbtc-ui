
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Redeem } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
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
      <div
        className={clsx(
          'w-48',
          'h-48',
          'ring-4',
          'ring-interlayCalifornia',
          'rounded-full',
          'inline-flex',
          'flex-col',
          'items-center',
          'justify-center'
        )}>
        <span className='mt-4'>
          {t('redeem_page.waiting_for')}
        </span>
        <span>
          {t('confirmations')}
        </span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayConifer',
            'font-medium'
          )}>
          {`${request.confirmations}/${stableBitcoinConfirmations}`}
        </span>
      </div>
      <p className='space-x-1'>
        <span className='text-textSecondary'>{t('issue_page.btc_transaction')}:</span>
        <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
      </p>
    </RequestWrapper>
  );
};

export default DefaultRedeemRequest;
