import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useMutation,
  useQueryClient
} from 'react-query';
import { FaCheckCircle } from 'react-icons/fa';
import clsx from 'clsx';
import { Issue } from '@interlay/interbtc-api';

import RequestWrapper from 'pages/Bridge/RequestWrapper';
import ErrorModal from 'components/ErrorModal';
import ExternalLink from 'components/ExternalLink';
import
InterlayDenimOrKintsugiMidnightOutlinedButton from
  'components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
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
import { USER_ISSUE_REQUESTS_FETCHER } from 'services/user-issue-requests-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  request: Issue;
}

const ConfirmedIssueRequest = ({
  request
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    address,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();
  const executeMutation = useMutation<void, Error, Issue>(
    (variables: Issue) => {
      if (!variables.btcTxId) {
        throw new Error('Bitcoin transaction ID not identified yet.');
      }
      return window.bridge.interBtcApi.issue.execute('0x' + variables.id, variables.btcTxId);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          USER_ISSUE_REQUESTS_FETCHER,
          address,
          selectedPageIndex,
          TABLE_PAGE_LIMIT
        ]);
        toast.success(t('issue_page.successfully_executed', { id: variables.id }));
      }
    }
  );

  const handleExecute = (request: Issue) => () => {
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
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            {t('issue_page.btc_transaction')}:
          </span>
          <span className='font-medium'>{shortAddress(request.btcTxId || '')}</span>
        </p>
        <ExternalLink
          className='text-sm'
          href={`${BTC_TRANSACTION_API}${request.btcTxId}`}>
          {t('issue_page.view_on_block_explorer')}
        </ExternalLink>
        <p
          className={clsx(
            'text-justify',
            { 'text-interlayTextSecondaryInLightMode':
              process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {t('issue_page.receive_interbtc_tokens', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
        <InterlayDenimOrKintsugiMidnightOutlinedButton
          pending={executeMutation.isLoading}
          onClick={handleExecute(request)}>
          {t('issue_page.claim_interbtc', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </InterlayDenimOrKintsugiMidnightOutlinedButton>
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
