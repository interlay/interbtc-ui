
import { useTranslation } from 'react-i18next';

function TestnetBanner() {
  const { t } = useTranslation();

  return (
    <div
      style={{ margin: 16 }}
      className='alert border-danger text-center'>
      <strong className='font-pink'>
        {t('testnet.warning')}
      </strong>
    </div>
  );
}

export default TestnetBanner;
