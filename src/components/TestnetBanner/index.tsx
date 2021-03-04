
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import styles from './testnet-banner.module.css';

function TestnetBanner() {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(styles['testnet-banner'], 'alert border-danger text-center')}>
      <strong className='font-pink'>
        {t('testnet.warning')}
      </strong>
    </div>
  );
}

export default TestnetBanner;
