import { CurrencyIdLiteral, newAccountId, newMonetaryAmount } from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { StoreType } from '@/common/types/util.types';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import ErrorModal from '@/components/ErrorModal';
import {
  GOVERNANCE_TOKEN,
  GOVERNANCE_TOKEN_SYMBOL,
  RELAY_CHAIN_NATIVE_TOKEN,
  RELAY_CHAIN_NATIVE_TOKEN_SYMBOL,
  WRAPPED_TOKEN,
  WRAPPED_TOKEN_SYMBOL
} from '@/config/relay-chains';
import RequestWrapper from '@/pages/Bridge/RequestWrapper';
import { ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import useQueryParams from '@/utils/hooks/use-query-params';

interface Props {
  // TODO: should type properly (`Relay`)
  request: {
    backingPayment: {
      amount: number;
      btcTxId: string;
    };
    vault: {
      accountId: string;
      collateralToken: {
        token: CurrencyIdLiteral;
      };
      wrappedToken: {
        token: CurrencyIdLiteral;
      };
    };
  };
}

const CancelledIssueRequest = ({ request }: Props): JSX.Element => {
  // ray test touch <
  console.log('ray : ***** request => ', request);
  // ray test touch >
  const { t } = useTranslation();

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

  // ray test touch <
  const { data: vaultCapacity, error: vaultCapacityError } = useQuery({
    queryKey: 'vault-capacity',
    queryFn: async () => {
      const vaultAccountId = newAccountId(window.bridge.api, request.vault.accountId);

      let collateralCurrency;
      if (request.vault.collateralToken.token === RELAY_CHAIN_NATIVE_TOKEN_SYMBOL) {
        collateralCurrency = RELAY_CHAIN_NATIVE_TOKEN;
      } else if (request.vault.collateralToken.token === GOVERNANCE_TOKEN_SYMBOL) {
        collateralCurrency = GOVERNANCE_TOKEN;
      } else {
        // TODO: `SDOT` will break here
        throw new Error(`Unsupported collateral token (${request.vault.collateralToken.token})!`);
      }

      return await window.bridge.vaults.getIssuableTokensFromVault(vaultAccountId, collateralCurrency);
    }
  });
  console.log('ray : ***** vaultCapacity => ', vaultCapacity);
  console.log('ray : ***** vaultCapacityError => ', vaultCapacityError);

  const backingPaymentAmount = newMonetaryAmount(request.backingPayment.amount, WRAPPED_TOKEN);
  console.log('ray : ***** backingPaymentAmount.toString() => ', backingPaymentAmount.toString());

  const executable = vaultCapacity?.gte(backingPaymentAmount);
  console.log('ray : ***** executable => ', executable);
  // ray test touch >

  // TODO: should type properly (`Relay`)
  const handleExecute = (request: any) => () => {
    if (!bridgeLoaded) return;

    executeMutation.mutate(request);
  };

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
        {request.backingPayment.btcTxId && (
          <InterlayDenimOrKintsugiMidnightOutlinedButton
            pending={executeMutation.isLoading}
            // ray test touch <
            disabled={!executable}
            // ray test touch >
            onClick={handleExecute(request)}
          >
            {t('issue_page.claim_interbtc', {
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </InterlayDenimOrKintsugiMidnightOutlinedButton>
        )}
      </RequestWrapper>
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
    </>
  );
};

export default CancelledIssueRequest;
