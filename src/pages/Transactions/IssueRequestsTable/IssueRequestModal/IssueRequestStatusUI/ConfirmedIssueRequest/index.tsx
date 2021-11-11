import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useMutation,
  useQueryClient
} from 'react-query';
import { FaCheckCircle } from 'react-icons/fa';
import clsx from 'clsx';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import ErrorModal from 'components/ErrorModal';
import ExternalLink from 'components/ExternalLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import useQueryParams from 'utils/hooks/use-query-params';
import { BTC_TRANSACTION_API } from 'config/bitcoin';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { QUERY_PARAMETERS } from 'utils/constants/links';
import { TABLE_PAGE_LIMIT } from 'utils/constants/general';
import { shortAddress } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { ISSUE_FETCHER } from 'services/fetchers/issue-request-fetcher';

interface Props {
  request: any;
}

const ConfirmedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();
  const executeMutation = useMutation<void, Error, any>(
    (variables: any) => {
      return window.bridge.interBtcApi.issue.execute('0x' + variables.id, variables.backingPayment.btcTxId);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          ISSUE_FETCHER,
          selectedPageIndex * TABLE_PAGE_LIMIT,
          TABLE_PAGE_LIMIT
        ]);
        toast.success(t('issue_page.successfully_executed', { id: variables.id }));
      }
    }
  );

  const handleExecute = (request: any) => () => {
    if (!bridgeLoaded) return;

    executeMutation.mutate(request);
  };

  return (
    <>
      <RequestWrapper className='px-12'>
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
          <span
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            {t('issue_page.btc_transaction')}:
          </span>
          <span className='font-medium'>{shortAddress(request.backingPayment.btcTxId || '')}</span>
        </p>
        <ExternalLink
          className='text-sm'
          href={`${BTC_TRANSACTION_API}${request.backingPayment.btcTxId}`}>
          {t('issue_page.view_on_block_explorer')}
        </ExternalLink>
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {t('issue_page.receive_interbtc_tokens', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
        <InterlayDenimOutlinedButton
          pending={executeMutation.isLoading}
          onClick={handleExecute(request)}>
          {t('issue_page.claim_interbtc', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </InterlayDenimOutlinedButton>
      </RequestWrapper>
      {(executeMutation.isError && executeMutation.error) && (
        <ErrorModal
          open={!!executeMutation.error}
          onClose={() => {
            executeMutation.reset();
          }}
          title='Error'
          description={
            typeof executeMutation.error === 'string' ?
              executeMutation.error :
              executeMutation.error.message
          } />
      )}
    </>
  );
};

export default ConfirmedIssueRequest;
