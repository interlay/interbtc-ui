
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

function TestnetBanner() {
  const { t } = useTranslation();

  return (
    <div
      // TODO: hardcoded
      style={{ borderColor: '#e6007a' }}
      className={clsx(
        'px-5',
        'py-3',
        'm-4',
        'sm:mx-auto',
        'md:max-w-3xl',
        'border',
        'border-solid',
        // 'border-red-500',
        'rounded',
        'text-center'
      )}>
      <strong className='font-pink'>
        {t('testnet.warning')}
      </strong>
    </div>
  );
}

export default TestnetBanner;
