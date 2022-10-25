import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
// ray test touch <
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { StoreType } from '@/common/types/util.types';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import ErrorModal from '@/components/ErrorModal';
// ray test touch >
import { WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
// ray test touch <
import { ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
// ray test touch >
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
// ray test touch <
import useQueryParams from '@/utils/hooks/use-query-params';
// ray test touch >

// ray test touch <
interface Props {
  // TODO: should type properly (`Relay`)
  request: any;
}

const CancelledIssueRequest = ({ request }: Props): JSX.Element => {
  console.log('ray : ***** request => ', request);
  // ray test touch >
  const { t } = useTranslation();

  // ray test touch <
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const queryParams = useQueryParams();
  const selectedPage = Number(queryParams.get(QUERY_PARAMETERS.PAGE)) || 1;
  const selectedPageIndex = selectedPage - 1;

  const queryClient = useQueryClient();
  // TODO: should type properly (`Relay`)
  const executeMutation = useMutation<void, Error, any>(
    (variables: any) => {
      if (!variables.backingPayment.btcTxId) {
        throw new Error('Bitcoin transaction ID not identified yet.');
      }
      return window.bridge.issue.execute(variables.id, variables.backingPayment.btcTxId);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([ISSUES_FETCHER, selectedPageIndex * TABLE_PAGE_LIMIT, TABLE_PAGE_LIMIT]);
        toast.success(t('issue_page.successfully_executed', { id: variables.id }));
      }
    }
  );

  // TODO: should type properly (`Relay`)
  const handleExecute = (request: any) => () => {
    if (!bridgeLoaded) return;

    executeMutation.mutate(request);
  };
  // ray test touch >

  return (
    <>
      <RequestWrapper className='px-12'>
        <h2 className={clsx('text-3xl', 'font-medium', getColorShade('red'))}>{t('cancelled')}</h2>
        <FaTimesCircle className={clsx('w-40', 'h-40', getColorShade('red'))} />
        <p
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'text-justify'
          )}
        >
          {t('issue_page.you_did_not_send', {
            wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
          })}
        </p>
        {/* TODO: could componentize */}
        <div>
          <h6 className={clsx('flex', 'items-center', 'justify-center', 'space-x-0.5', getColorShade('red'))}>
            <span>{t('note')}</span>
            <FaExclamationCircle />
          </h6>
          <p
            className={clsx(
              'text-justify',
              { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}
          >
            {t('issue_page.contact_team')}
          </p>
        </div>
        {/* ray test touch < */}
        {request.backingPayment.btcTxId && (
          <InterlayDenimOrKintsugiMidnightOutlinedButton
            pending={executeMutation.isLoading}
            onClick={handleExecute(request)}
          >
            {t('issue_page.claim_interbtc', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </InterlayDenimOrKintsugiMidnightOutlinedButton>
        )}
        {/* ray test touch > */}
      </RequestWrapper>
      {/* ray test touch < */}
      {executeMutation.isError && executeMutation.error && (
        <ErrorModal
          open={!!executeMutation.error}
          onClose={() => {
            executeMutation.reset();
          }}
          title='Error'
          description={
            typeof executeMutation.error === 'string' ? executeMutation.error : executeMutation.error.message
          }
        />
      )}
      {/* ray test touch > */}
    </>
  );
};

export default CancelledIssueRequest;
