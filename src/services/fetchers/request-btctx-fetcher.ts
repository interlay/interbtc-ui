import { BitcoinAmount } from '@interlay/monetary-js';
import { stripHexPrefix, ElectrsAPI } from '@interlay/interbtc-api';

export type TxDetails = {
  txid?: string;
  blockHeight?: number;
  confirmations?: number;
  btcAmountSubmitted?: number;
};

export default async function getTxDetailsForRequest(
  electrsAPI: ElectrsAPI,
  requestId: string,
  recipient: string,
  useOpReturn?: boolean,
  monetaryAmountBtc?: BitcoinAmount
): Promise<TxDetails> {
  const txDetails: TxDetails = {};
  try {
    txDetails.txid = await (useOpReturn ?
      electrsAPI.getTxIdByOpReturn(stripHexPrefix(requestId), recipient, monetaryAmountBtc) :
      electrsAPI.getEarliestPaymentToRecipientAddressTxId(recipient, monetaryAmountBtc));
    txDetails.btcAmountSubmitted = await electrsAPI.getUtxoAmount(txDetails.txid, recipient);
  } catch (e) {
    // no tx found, return null
    return txDetails;
  }

  // tx has been found, get confirmations
  const { confirmations, blockHeight } = await electrsAPI.getTransactionStatus(txDetails.txid);
  txDetails.confirmations = confirmations;
  txDetails.blockHeight = blockHeight;

  return txDetails;
}
