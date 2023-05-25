import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { BTC_EXPLORER_TRANSACTION_API } from '@/config/blockstream-explorer-links';
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import AddressWithCopyUI from '@/legacy-components/AddressWithCopyUI';
import ErrorModal from '@/legacy-components/ErrorModal';
import ExternalLink from '@/legacy-components/ExternalLink';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import { Transaction, useTransaction } from '@/utils/hooks/transaction';
import useQueryParams from '@/utils/hooks/use-query-params';

import ManualIssueExecutionUI from '../ManualIssueExecutionUI';

interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const ConfirmedIssueRequest = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();

  // TODO: check if this transaction is necessary
  const transaction = useTransaction(Transaction.ISSUE_EXECUTE, {
    onSuccess: (_, variables) => {
      const [requestId] = variables.args;
      queryClient.invalidateQueries([ISSUES_FETCHER, selectedPageIndex * TABLE_PAGE_LIMIT, TABLE_PAGE_LIMIT]);
      toast.success(t('issue_page.successfully_executed', { id: requestId }));
    }
  });

  return (
    <>
      <RequestWrapper className='px-12'>
        <h2 className={clsx('text-3xl', 'font-medium', getColorShade('green'))}>{t('confirmed')}</h2>
        <FaCheckCircle className={clsx('w-40', 'h-40', getColorShade('green'))} />
        <div className={clsx('space-x-1', 'flex', 'items-center')}>
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {t('issue_page.btc_transaction')}:
          </span>
          <AddressWithCopyUI address={request.backingPayment.btcTxId || ''} />
        </div>
        <ExternalLink className='text-sm' href={`${BTC_EXPLORER_TRANSACTION_API}${request.backingPayment.btcTxId}`}>
          {t('issue_page.view_on_block_explorer')}
        </ExternalLink>
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}
        >
          {t('issue_page.receive_interbtc_tokens', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
        <ManualIssueExecutionUI request={request} />
      </RequestWrapper>
      {transaction.isError && transaction.error && (
        <ErrorModal
          open={!!transaction.error}
          onClose={() => {
            transaction.reset();
          }}
          title='Error'
          description={typeof transaction.error === 'string' ? transaction.error : transaction.error.message}
        />
      )}
    </>
  );
};

export default ConfirmedIssueRequest;
