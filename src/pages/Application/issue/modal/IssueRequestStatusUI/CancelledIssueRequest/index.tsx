
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';

import IssueRequestWrapper from '../IssueRequestWrapper';

const CancelledIssueRequest = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IssueRequestWrapper id='CancelledIssueRequest'>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayScarlet'
        )}>
        {t('cancelled')}
      </h2>
      <FaTimesCircle
        className={clsx(
          'w-40',
          'h-40',
          'text-interlayScarlet'
        )} />
      <p
        className={clsx(
          'text-textSecondary',
          'px-10',
          'text-justify'
        )}>
        {t('issue_page.you_did_not_send')}
      </p>
      <div>
        <h6
          className={clsx(
            'flex',
            'items-center',
            'justify-center',
            'space-x-0.5',
            'text-interlayScarlet'
          )}>
          <span>{t('note')}</span>
          <FaExclamationCircle />
        </h6>
        <p
          className={clsx(
            'px-10',
            'text-justify',
            'text-textSecondary'
          )}>
          {t('issue_page.contact_team')}
        </p>
      </div>
    </IssueRequestWrapper>
  );
};

export default CancelledIssueRequest;
