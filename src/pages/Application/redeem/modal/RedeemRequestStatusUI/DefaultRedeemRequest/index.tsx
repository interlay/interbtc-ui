
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import RequestWrapper from 'pages/Application/RequestWrapper';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { RedeemRequest } from 'common/types/redeem.types';

interface Props {
  request: RedeemRequest;
}

const DefaultRedeemRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    (async () => {
      try {
        const theStableBitcoinConfirmations = await window.polkaBTC.btcRelay.getStableBitcoinConfirmations();

        setStableBitcoinConfirmations(theStableBitcoinConfirmations);
      } catch (error) {
        // TODO: should add error handling UX
        console.log('[RedeemRequestStatusUI useEffect] error.message => ', error.message);
      }
    })();
  }, [
    request,
    polkaBtcLoaded
  ]);

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
          'ring-interlayTreePoppy',
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
            'text-interlayMalachite',
            'font-medium'
          )}>
          {`${request.confirmations}/${stableBitcoinConfirmations}`}
        </span>
      </div>
      <p className='space-x-1'>
        <span className='text-textSecondary'>{t('issue_page.btc_transaction')}:</span>
        <span className='font-medium'>{shortAddress(request.btcTxId)}</span>
      </p>
    </RequestWrapper>
  );
};

export default DefaultRedeemRequest;
