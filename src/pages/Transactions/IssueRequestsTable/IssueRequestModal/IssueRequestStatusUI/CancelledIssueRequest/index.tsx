
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';

import RequestWrapper from 'pages/Bridge/RequestWrapper';

const CancelledIssueRequest = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RequestWrapper
      id='CancelledIssueRequest'
      className='px-12'>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayCinnabar'
        )}>
        {t('cancelled')}
      </h2>
      <FaTimesCircle
        className={clsx(
          'w-40',
          'h-40',
          'text-interlayCinnabar'
        )} />
      <p
        className={clsx(
          'text-textSecondary',
          'text-justify'
        )}>
        {t('issue_page.you_did_not_send')}
      </p>
      {/* TODO: could componentize */}
      <div>
        <h6
          className={clsx(
            'flex',
            'items-center',
            'justify-center',
            'space-x-0.5',
            'text-interlayCinnabar'
          )}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
        </h6>
        <p
          className={clsx(
            'text-justify',
            'text-textSecondary'
          )}>
          {t('issue_page.contact_team')}
        </p>
      </div>
    </RequestWrapper>
  );
};

export default CancelledIssueRequest;
