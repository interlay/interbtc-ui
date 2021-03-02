import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export default function TestnetBanner(): ReactElement {
  const { t } = useTranslation();
  return (
    <div className='row justify-content-center bg-white'>
      <div className='col-md-auto'>
        <div className='alert border-danger text-center'>
          <b className='font-pink'>{t('testnet.warning')}</b>
        </div>
      </div>
    </div>
  );
}
