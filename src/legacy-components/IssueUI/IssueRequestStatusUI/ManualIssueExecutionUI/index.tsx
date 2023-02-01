import {
  CurrencyIdLiteral,
  currencyIdToMonetaryCurrency,
  IssueStatus,
  newAccountId,
  newMonetaryAmount
} from '@interlay/interbtc-api';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { displayMonetaryAmount } from '@/common/utils/utils';
import { WRAPPED_TOKEN, WRAPPED_TOKEN_SYMBOL } from '@/config/relay-chains';
import InterlayDenimOrKintsugiMidnightOutlinedButton from '@/legacy-components/buttons/InterlayDenimOrKintsugiMidnightOutlinedButton';
import ErrorModal from '@/legacy-components/ErrorModal';
import { ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import { TABLE_PAGE_LIMIT } from '@/utils/constants/general';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { getColorShade } from '@/utils/helpers/colors';
import useQueryParams from '@/utils/hooks/use-query-params';

// TODO: issue requests should not be typed here but further above in the app
interface Props {
  request: {
    id: string;
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
    status: any;
  };
}

const ManualIssueExecutionUI = ({ request }: Props): JSX.Element => {
  const { t } = useTranslation();

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

  const { data: vaultCapacity, error: vaultCapacityError } = useQuery({
    queryKey: 'vault-capacity',
    queryFn: async () => {
      const vaultAccountId = newAccountId(window.bridge.api, request.vault.accountId);

      const issue = await window.bridge.issue.getRequestById(request.id);

      const collateralToken = await currencyIdToMonetaryCurrency(
        window.bridge.api,
        issue.vaultId.currencies.collateral
      );

      return await window.bridge.vaults.getIssuableTokensFromVault(vaultAccountId, collateralToken);
    }
  });

  // TODO: should type properly (`Relay`)
  const handleExecute = (request: any) => () => {
    executeMutation.mutate(request);
  };

  const backingPaymentAmount = newMonetaryAmount(request.backingPayment.amount, WRAPPED_TOKEN);

  let executable;
  // If status is Cancelled or Expired, vault needs to have sufficient capacity
  if (request.status === IssueStatus.Cancelled || request.status === IssueStatus.Expired) {
    executable = vaultCapacity?.gte(backingPaymentAmount);
  } else {
    // Confirmed == PendingWithEnoughConfirmations is always executable
    executable = true;
  }

  return (
    <div className={clsx('text-center', 'space-y-2')}>
      {vaultCapacity && (
        <p
          className={clsx(
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
            'text-justify'
          )}
        >
          {executable
            ? t('issue_page.vault_has_capacity_you_can_claim', {
                vaultCapacity: displayMonetaryAmount(vaultCapacity),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })
            : t('issue_page.vault_has_capacity_you_can_not_claim', {
                vaultCapacity: displayMonetaryAmount(vaultCapacity),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
        </p>
      )}
      {vaultCapacityError && (
        <p className={clsx(getColorShade('red'), 'text-sm')}>
          {vaultCapacityError instanceof Error ? vaultCapacityError.message : String(vaultCapacityError)}
        </p>
      )}
      <InterlayDenimOrKintsugiMidnightOutlinedButton
        className='w-full'
        pending={executeMutation.isLoading}
        disabled={!executable}
        onClick={handleExecute(request)}
      >
        {t('issue_page.claim_interbtc', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        })}
      </InterlayDenimOrKintsugiMidnightOutlinedButton>
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
    </div>
  );
};

export default ManualIssueExecutionUI;
