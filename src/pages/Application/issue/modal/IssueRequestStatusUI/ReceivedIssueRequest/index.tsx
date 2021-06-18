
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';

import IssueRequestWrapper from '../../IssueRequestWrapper';
import InterlayLink from 'components/UI/InterlayLink';
import { shortAddress } from 'common/utils/utils';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { IssueRequest } from 'common/types/issue.types';

interface Props {
  request: IssueRequest;
}

const ReceivedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = React.useState(1);
  const [stableParachainConfirmations, setStableParachainConfirmations] = React.useState(100);
  const [requestConfirmations, setRequestConfirmations] = React.useState(0);

  React.useEffect(() => {
    if (!request.creation) return;

    (async () => {
      const [
        theStableBitcoinConfirmations,
        theStableParachainConfirmations,
        parachainHeight
      ] = await Promise.all([
        await window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
        await window.polkaBTC.btcRelay.getStableParachainConfirmations(),
        await window.polkaBTC.system.getCurrentBlockNumber()
      ]);
      setStableBitcoinConfirmations(theStableBitcoinConfirmations);
      setStableParachainConfirmations(theStableParachainConfirmations);
      setRequestConfirmations(parachainHeight - Number(request.creation));
    })();
  }, [request.creation]);

  return (
    <IssueRequestWrapper id='ReceivedIssueRequest'>
      <h2
        className={clsx(
          'text-3xl',
          'font-medium'
        )}>
        {t('received')}
      </h2>
      <div
        className={clsx(
          'w-48',
          'h-48',
          'ring-4',
          'ring-interlayMalachite',
          'rounded-full',
          'inline-flex',
          'flex-col',
          'items-center',
          'justify-center'
        )}>
        <span>{t('issue_page.waiting_for')}</span>
        <span>{t('confirmations')}</span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayMalachite',
            'font-medium'
          )}>
          {`${request.confirmations}/${stableBitcoinConfirmations}`}
        </span>
        <span
          className={clsx(
            'text-2xl',
            'text-interlayMalachite',
            'font-medium'
          )}>
          {`${requestConfirmations}/${stableParachainConfirmations}`}
        </span>
      </div>
      <p className='space-x-1'>
        <span className='text-textSecondary'>{t('issue_page.btc_transaction')}:</span>
        <span className='font-medium'>{shortAddress(request.btcTxId)}</span>
      </p>
      <InterlayLink
        className={clsx(
          'text-interlayDodgerBlue',
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
    </IssueRequestWrapper>
  );
};

export default ReceivedIssueRequest;
