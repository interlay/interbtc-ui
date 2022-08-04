import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';

const CancelledIssueRequest = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RequestWrapper className='px-12'>
      <h2 className={clsx('text-3xl', 'font-medium', getColorShade('red'))}>{t('cancelled')}</h2>
      <FaTimesCircle className={clsx('w-40', 'h-40', getColorShade('red'))} />
      <p
        className={clsx(
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          'text-justify'
        )}
      >
        {t('issue_page.you_did_not_send', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        })}
      </p>
      {/* TODO: could componentize */}
      <div>
        <h6 className={clsx('flex', 'items-center', 'justify-center', 'space-x-0.5', getColorShade('red'))}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
        </h6>
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.contact_team')}
        </p>
      </div>
    </RequestWrapper>
  );
};

export default CancelledIssueRequest;
