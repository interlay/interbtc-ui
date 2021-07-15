import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';

import {
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import clsx from 'clsx';

import RequestWrapper from 'pages/Home/RequestWrapper';
import ErrorModal from 'components/ErrorModal';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import { shortAddress } from 'common/utils/utils';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import STATUSES from 'utils/constants/statuses';
import { StoreType } from 'common/types/util.types';
import { updateIssueRequestAction } from 'common/actions/issue.actions';
import { updateBalancePolkaBTCAction } from 'common/actions/general.actions';
import { Issue, IssueStatus } from '@interlay/interbtc';
import { BTCAmount } from '@interlay/monetary-js';

type Props = {
  request: Issue;
};

const ConfirmedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    polkaBtcLoaded,
    balanceInterBTC
  } = useSelector((state: StoreType) => state.general);

  const [executeStatus, setExecuteStatus] = React.useState(STATUSES.IDLE);
  const [executeError, setExecuteError] = React.useState<Error | null>(null);

  const handleExecute = (request: Issue) => async () => {
    try {
      if (!polkaBtcLoaded) return;

      setExecuteStatus(STATUSES.PENDING);
      await window.polkaBTC.issue.execute('0x' + request.id, request.btcTxId);

      const completedReq = request;
      completedReq.status = IssueStatus.Completed;

      dispatch(
        updateBalancePolkaBTCAction(
          balanceInterBTC
            .add(BTCAmount.from.BTC((request.executedAmountBTC && request.executedAmountBTC !== '0') ?
              request.executedAmountBTC :
              request.amountInterBTC))
        )
      );
      dispatch(updateIssueRequestAction(completedReq));

      setExecuteStatus(STATUSES.RESOLVED);

      toast.success(t('issue_page.successfully_executed', { id: request.id }));
    } catch (error) {
      toast.error(`${t('issue_page.execute_failed')}: ${error.message}`);
      setExecuteStatus(STATUSES.REJECTED);
      setExecuteError(error);
    }
  };

  return (
    <>
      <RequestWrapper
        id='ConfirmedIssueRequest'
        className='px-12'>
        <h2
          className={clsx(
            'text-3xl',
            'font-medium',
            'text-interlayConifer'
          )}>
          {t('confirmed')}
        </h2>
        <FaCheckCircle
          className={clsx(
            'w-40',
            'h-40',
            'text-interlayConifer'
          )} />
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
        <p
          className={clsx(
            'text-justify',
            'text-textSecondary'
          )}>
          {t('issue_page.receive_interbtc_tokens')}
        </p>
        <InterlayDenimOutlinedButton
          pending={executeStatus === STATUSES.PENDING}
          onClick={handleExecute(request)}>
          {t('issue_page.claim_interbtc')}
        </InterlayDenimOutlinedButton>
      </RequestWrapper>
      {(executeStatus === STATUSES.REJECTED && executeError) && (
        <ErrorModal
          open={!!executeError}
          onClose={() => {
            setExecuteStatus(STATUSES.IDLE);
            setExecuteError(null);
          }}
          title='Error'
          description={
            typeof executeError === 'string' ?
              executeError :
              executeError.message
          } />
      )}
    </>
  );
};

export default ConfirmedIssueRequest;
