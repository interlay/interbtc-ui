
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';
import Big from 'big.js';

import {
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import clsx from 'clsx';

import RequestWrapper from '../../../../RequestWrapper';
import ErrorModal from 'components/ErrorModal';
import InterlayLink from 'components/UI/InterlayLink';
import InterlayButton from 'components/UI/InterlayButton';
import { shortAddress } from 'common/utils/utils';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import STATUSES from 'utils/constants/statuses';
import { StoreType } from 'common/types/util.types';
import { updateIssueRequestAction } from 'common/actions/issue.actions';
import { updateBalancePolkaBTCAction } from 'common/actions/general.actions';
import {
  IssueRequest,
  IssueRequestStatus
} from 'common/types/issue.types';

type Props = {
  request: IssueRequest;
};

const ConfirmedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    polkaBtcLoaded,
    balancePolkaBTC
  } = useSelector((state: StoreType) => state.general);

  const [executeStatus, setExecuteStatus] = React.useState(STATUSES.IDLE);
  const [executeError, setExecuteError] = React.useState<Error | null>(null);

  const handleExecute = (request: IssueRequest) => async () => {
    try {
      if (!polkaBtcLoaded) return;

      setExecuteStatus(STATUSES.PENDING);
      await window.polkaBTC.issue.execute('0x' + request.id, request.btcTxId);

      const completedReq = request;
      completedReq.status = IssueRequestStatus.Completed;

      dispatch(
        updateBalancePolkaBTCAction(
          new Big(balancePolkaBTC)
            .add(new Big(request.issuedAmountBtc || request.requestedAmountPolkaBTC))
            .toString()
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
            'text-interlayMalachite'
          )}>
          {t('confirmed')}
        </h2>
        <FaCheckCircle
          className={clsx(
            'w-40',
            'h-40',
            'text-interlayMalachite'
          )} />
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
        <p
          className={clsx(
            'text-justify',
            'text-textSecondary'
          )}>
          {t('issue_page.receive_polkabtc_tokens')}
        </p>
        <InterlayButton
          variant='outlined'
          color='primary'
          pending={executeStatus === STATUSES.PENDING}
          onClick={handleExecute(request)}>
          {t('issue_page.claim_polkabtc')}
        </InterlayButton>
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
