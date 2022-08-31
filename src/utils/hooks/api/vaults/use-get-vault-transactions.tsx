import { ReplaceRequestExt } from '@interlay/interbtc-api';
import { H256 } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { ACCOUNT_ID_TYPE_NAME } from '@/config/general';
import genericFetcher, { GENERIC_FETCHER } from '@/services/fetchers/generic-fetcher';
import issuesFetcher, { ISSUES_FETCHER } from '@/services/fetchers/issues-fetcher';
import redeemsFetcher, { REDEEMS_FETCHER } from '@/services/fetchers/redeems-fetcher';

const parseTransactionsData = (issues: any, redeems: any, replaceRequests: any) => {
  const mappedIssues = issues
    ? issues.map((issue: any) => {
        return {
          id: issue.id,
          type: 'issue',
          amount: issue.request.amountWrapped,
          status: issue.status,
          timestamp: issue.request.timestamp
        };
      })
    : undefined;

  const mappedRedeems = redeems
    ? redeems.map((redeem: any) => {
        return {
          id: redeem.id,
          type: 'redeem',
          amount: redeem.request.requestedAmountBacking,
          status: redeem.status,
          timestamp: redeem.request.timestamp
        };
      })
    : undefined;

  const mappedReplaceRequests = replaceRequests
    ? redeems.map((replaceRequest: any) => {
        return {
          id: replaceRequest.id,
          type: 'replaceRequest',
          amount: replaceRequest.collateral,
          status: replaceRequest.status
        };
      })
    : undefined;

  return mappedIssues && mappedRedeems ? [...mappedIssues, ...mappedRedeems, ...mappedReplaceRequests] : [];
};

const useGetVaultTransactions = (address: string, collateralTokenIdLiteral: string): any => {
  const vaultId = window.bridge?.api.createType(ACCOUNT_ID_TYPE_NAME, address);

  const { data: issues, error: issuesError } = useQuery<any, Error>(
    [
      ISSUES_FETCHER,
      0, // offset
      10, // limit
      `vault: {accountId_eq: "${address}", collateralToken: {token_eq: ${collateralTokenIdLiteral}}}`
    ],
    issuesFetcher
  );
  useErrorHandler(issuesError);

  const { data: redeems, error: redeemsError } = useQuery<any, Error>(
    [
      REDEEMS_FETCHER,
      0, // offset
      10, // limit
      `vault: {accountId_eq: "${address}", collateralToken: {token_eq: ${collateralTokenIdLiteral}}}`
    ],
    redeemsFetcher
  );
  useErrorHandler(redeemsError);

  // TODO: removing the generic fetcher in this instance caused a type error. This needs to be fixed.
  const { data: replaceRequests, error: replaceRequestsError } = useQuery<Map<H256, ReplaceRequestExt>, Error>(
    [GENERIC_FETCHER, 'replace', 'mapReplaceRequests', vaultId],
    genericFetcher<Map<H256, ReplaceRequestExt>>()
  );
  useErrorHandler(replaceRequestsError);

  return parseTransactionsData(issues, redeems, replaceRequests);
};

export { useGetVaultTransactions };
