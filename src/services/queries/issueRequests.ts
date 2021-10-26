import { BitcoinAmount, KusamaAmount } from '@interlay/monetary-js';
import { IssueStatus } from '@interlay/interbtc-api';
import { btcAddressFromEventToString } from 'common/utils/utils';
import { BITCOIN_NETWORK } from '../../constants';
import getTxDetailsForRequest from 'services/fetchers/request-btctx-fetcher';

const query = `
  query ($limit: Int!, $offset: Int) {
    issues(orderBy: createdAt_ASC, limit: $limit, offset: $offset) {
      id
      request {
        requestedAmountWrapped
        timestamp
        height {
          absolute
          active
        }
      }
      userParachainAddress
      vaultParachainAddress
      vaultBackingAddress
      vaultWalletPubkey
      bridgeFee
      griefingCollateral
      status
      execution {
        height {
          absolute
          active
        }
        executedAmountWrapped
        timestamp
      }
      cancellation {
        timestamp
        height {
          absolute
          active
        }
      }
      createdAt
    }
  }
`;

// TODO: type graphql query return
export function processIssueAmounts(issueObjRef: any): any {
  issueObjRef.request.requestedAmountWrapped = BitcoinAmount.from.Satoshi(issueObjRef.request.requestedAmountWrapped);
  issueObjRef.bridgeFee = BitcoinAmount.from.Satoshi(issueObjRef.bridgeFee);
  issueObjRef.griefingCollateral = KusamaAmount.from.Planck(issueObjRef.griefingCollateral);
  if (issueObjRef.execution) {
    issueObjRef.execution.executedAmountWrapped =
      BitcoinAmount.from.Satoshi(issueObjRef.execution.executedAmountWrapped);
  }
  issueObjRef.vaultBackingAddress = btcAddressFromEventToString(issueObjRef.vaultBackingAddress, BITCOIN_NETWORK);
}

export default query;
