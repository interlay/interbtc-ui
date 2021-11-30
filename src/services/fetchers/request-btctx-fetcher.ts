import {
  stripHexPrefix,
  ElectrsAPI
} from '@interlay/interbtc-api';

import graphqlFetcher, { GRAPHQL_FETCHER } from './graphql-fetcher';

type TxDetails = {
  btcTxId?: string;
  blockHeight?: number;
  confirmations?: number;
  amount?: number;
  confirmedAtParachainActiveBlock?: number;
};

async function getTxDetailsForRequest(
  electrsAPI: ElectrsAPI,
  requestId: string,
  recipient: string,
  stableBtcConfirmations: number,
  useOpReturn?: boolean
): Promise<TxDetails> {
  const txDetails: TxDetails = {};
  try {
    txDetails.btcTxId =
    await (
      useOpReturn ?
        electrsAPI.getTxIdByOpReturn(stripHexPrefix(requestId), recipient) :
        electrsAPI.getEarliestPaymentToRecipientAddressTxId(recipient)
    );
    txDetails.amount = await electrsAPI.getUtxoAmount(txDetails.btcTxId, recipient);
  } catch (error) {
    // no tx found, return null
    return txDetails;
  }

  // tx has been found, get confirmations
  const {
    confirmations,
    blockHeight
  } = await electrsAPI.getTransactionStatus(txDetails.btcTxId);
  txDetails.confirmations = confirmations;
  txDetails.blockHeight = blockHeight;

  if (confirmations && confirmations >= stableBtcConfirmations) {
    const confirmedAtParachainActiveBlock = await graphqlFetcher<any>()({
      queryKey: [
        GRAPHQL_FETCHER,
        `query($height: Int!) {
          relayedBlocks(where: {backingHeight_eq: $height}) {
            relayedAtHeight {
              active
            }
          }
        }`,
        {
          height: txDetails.blockHeight
        }
      ]
    });
    txDetails.confirmedAtParachainActiveBlock =
      confirmedAtParachainActiveBlock?.data?.relayedBlocks[0]?.relayedAtHeight.active;
  }

  return txDetails;
}

export type {
  TxDetails
};

export default getTxDetailsForRequest;
