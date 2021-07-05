
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

function TestnetBanner(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'px-5',
        'py-3',
        'm-4',
        'md:mx-auto',
        'md:max-w-3xl',
        'border',
        'border-solid',
        'border-interlayDenim',
        'rounded',
        'text-center'
      )}>
      <strong className='text-interlayDenim'>
        {t('testnet.warning')}
      </strong>
    </div>
  );
}

export default TestnetBanner;
