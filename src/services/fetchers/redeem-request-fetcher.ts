import { BitcoinAmount } from '@interlay/monetary-js';
import {
  newMonetaryAmount,
  RedeemStatus
} from '@interlay/interbtc-api';

import { COLLATERAL_TOKEN } from 'config/relay-chains';
import redeemRequestQuery from 'services/queries/redeem-request-query';
import graphqlFetcher, { GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import getTxDetailsForRequest from 'services/fetchers/request-btctx-fetcher';

const REDEEM_FETCHER = 'redeem-fetcher';

// TODO: should type properly (`Relay`)
function decodeRedeemValues(redeem: any): any {
  redeem.request.requestedAmountBacking = BitcoinAmount.from.Satoshi(redeem.request.requestedAmountBacking);
  redeem.bridgeFee = BitcoinAmount.from.Satoshi(redeem.bridgeFee);
  redeem.btcTransferFee = BitcoinAmount.from.Satoshi(redeem.btcTransferFee);

  // TODO: get actual vault collateral when it's added to events
  redeem.collateralPremium = newMonetaryAmount(redeem.collateralPremium, COLLATERAL_TOKEN);
  if (redeem.cancellation) {
    redeem.cancellation.slashedCollateral =
      newMonetaryAmount(redeem.cancellation.slashedCollateral, COLLATERAL_TOKEN);
  }

  return redeem;
}

// TODO: should type properly (`Relay`)
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const redeemFetcher = async ({ queryKey }: any): Promise<Array<any>> => {
  const [
    key,
    offset,
    limit,
    stableBtcConfirmations,
    where
  ] = queryKey as RedeemFetcherParams;

  if (key !== REDEEM_FETCHER) throw new Error('Invalid key!');

  // TODO: should type properly (`Relay`)
  const redeemsData = await graphqlFetcher<Array<any>>()({ queryKey: [
    GRAPHQL_FETCHER,
    redeemRequestQuery(where),
    {
      limit,
      offset
    }
  ] });

  // TODO: should type properly (`Relay`)
  const redeems = redeemsData?.data?.redeems || [];

  return await Promise.all(redeems.map(async redeem => {
    redeem = decodeRedeemValues(redeem);
    redeem.backingPayment = await getTxDetailsForRequest(
      window.bridge.interBtcApi.electrsAPI,
      redeem.id,
      redeem.vaultBackingAddress,
      stableBtcConfirmations,
      true // Use op_return
    );
    return redeem;
  }));
};

// TODO: should type properly (`Relay`)
function getRedeemWithStatus(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  redeem: any,
  stableBtcConfirmations: number,
  stableParachainConfirmations: number,
  parachainActiveHeight: number
): any {
  stableParachainConfirmations = Number(stableParachainConfirmations);
  stableBtcConfirmations = Number(stableBtcConfirmations);
  parachainActiveHeight = Number(parachainActiveHeight);

  if (redeem.status !== 'Pending') {
    // ideally this would be auto-decoded, for now set by hand
    if (redeem.status === 'Expired') redeem.status = RedeemStatus.Expired;
    else if (redeem.status === 'Completed') redeem.status = RedeemStatus.Completed;
    else if (redeem.status === 'Retried') redeem.status = RedeemStatus.Retried;
    else if (redeem.status === 'Reimbursed') redeem.status = RedeemStatus.Reimbursed;
    return redeem;
  }

  if (!redeem.backingPayment || !redeem.backingPayment.btcTxId) {
    redeem.status = RedeemStatus.PendingWithBtcTxNotFound;
  } else if (!redeem.backingPayment.confirmations) {
    redeem.status = RedeemStatus.PendingWithBtcTxNotIncluded;
  } else if (
    redeem.backingPayment.confirmations < stableBtcConfirmations ||
    redeem.backingPayment.confirmedAtParachainActiveBlock === undefined ||
    redeem.backingPayment.confirmedAtParachainActiveBlock + stableParachainConfirmations > parachainActiveHeight
  ) {
    redeem.status = RedeemStatus.PendingWithTooFewConfirmations;
  } else {
    redeem.status = RedeemStatus.PendingWithEnoughConfirmations;
  }
  return redeem;
}

type RedeemFetcherParams = [
  key: typeof REDEEM_FETCHER,
  offset: number,
  limit: number,
  stableBtcConfirmations: number,
  where?: string,
]

export {
  getRedeemWithStatus,
  REDEEM_FETCHER
};

export type {
  RedeemFetcherParams
};

export default redeemFetcher;
