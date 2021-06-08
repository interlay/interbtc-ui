
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaTimesCircle } from 'react-icons/fa';

const CancelledIssueRequest = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      id='CancelledIssueRequest'
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'space-y-6'
      )}>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayScarlet'
        )}>
        {t('cancelled')}
      </h2>
      {/* ray test touch << */}
      <FaTimesCircle />
      {/* <div className='row'>
        <div className='col text-center'>
          <i className='fas fa-times-circle canceled-circle'></i>
        </div>
      </div> */}
      {/* ray test touch >> */}
      <div className='row justify-center mt-4'>
        <div className='col-9 status-description'>{t('issue_page.you_did_not_send')}</div>
      </div>
      <div className='row justify-center mt-5'>
        <div className='col-9 note-title'>
          {t('note')}&nbsp;
          <i className='fas fa-exclamation-circle'></i>
        </div>
      </div>
      <div className='row justify-center'>
        <div className='col-9 note-text'>{t('issue_page.contact_team')}</div>
      </div>
    </div>
  );
};

export default CancelledIssueRequest;
