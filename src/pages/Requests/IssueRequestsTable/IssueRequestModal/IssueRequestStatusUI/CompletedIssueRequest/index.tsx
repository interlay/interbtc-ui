import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';

import RequestWrapper from 'pages/Home/RequestWrapper';
import InterlayLink from 'components/UI/InterlayLink';
import { shortAddress } from 'common/utils/utils';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { Issue } from '@interlay/interbtc';

interface Props {
  request: Issue;
}

const CompletedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <RequestWrapper id='CompletedIssueRequest'>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium',
          'text-interlayConifer'
        )}>
        {t('completed')}
      </h2>
      <p
        className={clsx(
          'space-x-1',
          'font-medium'
        )}>
        <span>{t('issue_page.you_received')}</span>
        <span className='text-interlayDenim'>
          {request.executedAmountBTC || request.amountInterBTC} InterBTC
        </span>
      </p>
      <div
        className={clsx(
          'w-48',
          'h-48',
          'ring-4',
          'ring-interlayConifer',
          'rounded-full',
          'inline-flex',
          'flex-col',
          'items-center',
          'justify-center'
        )}>
        <span className='mt-4'>
          {t('issue_page.in_parachain_block')}
        </span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayConifer',
            'font-medium'
          )}>
          {request.creationBlock}
        </span>
      </div>
      {/* TODO: could componentize */}
      <InterlayLink
        className={clsx(
          'text-interlayDenim',
          'space-x-1.5',
          'inline-flex',
          'items-center',
          'text-sm'
        )}
        href='https://polkadot.js.org/apps/#/explorer'
        target='_blank'
        rel='noopener noreferrer'>
        <span>{t('issue_page.view_parachain_block')}</span>
        <FaExternalLinkAlt />
      </InterlayLink>
      <p className='space-x-1'>
        <span className='text-textSecondary'>{t('issue_page.btc_transaction')}:</span>
        <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
      </p>
      <InterlayLink
        className={clsx(
          'text-interlayDenim',
          'space-x-1.5',
          'inline-flex',
          'items-center',
          'text-sm'
        )}
        href={`${BTC_TRANSACTION_API}${request.btcTxId}`}
        target='_blank'
        rel='noopener noreferrer'>
        <span>
          {t('issue_page.view_on_block_explorer')}
        </span>
        <FaExternalLinkAlt />
      </InterlayLink>
    </RequestWrapper>
  );
};

export default CompletedIssueRequest;
