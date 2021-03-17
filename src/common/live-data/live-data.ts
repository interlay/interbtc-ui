import { Dispatch } from 'redux';
import fetchPrices from './price-watcher';
import fetchBtcRelayAndBitcoinHeight from './block-height-watcher';
import fetchTotals from './totals-watcher';
import fetchBalances from './balances-watcher';
import fetchIssueTransactions from './issue-transaction.watcher';
import fetchRedeemTransactions from './redeem-transaction.watcher';
import { StoreState } from '../types/util.types';

// TODO: should use web sockets instead of infinite times of fetch
export default function startFetchingLiveData(dispatch: Dispatch, store: StoreState): void {
  if (window.isFetchingActive) return;
  window.isFetchingActive = true;

  // FETCH LIVE DATA PRICES
  fetchPrices(dispatch, store);
  window.setInterval(() => fetchPrices(dispatch, store), 60000);

  // FETCH BTC-RELAY HEIGHT AND BITCOIN HEIGHT
  fetchBtcRelayAndBitcoinHeight(dispatch, store);
  window.setInterval(() => fetchBtcRelayAndBitcoinHeight(dispatch, store), 60000);

  // FETCH TOTALS
  fetchTotals(dispatch, store);
  window.setInterval(() => fetchTotals(dispatch, store), 60000);

  // FETCH BALANCES
  fetchBalances(dispatch, store);
  window.setInterval(() => fetchBalances(dispatch, store), 5000);

  // ray test touch <
  // FETCH ISSUE TRANSACTIONS
  fetchIssueTransactions(dispatch, store);
  window.setInterval(() => fetchIssueTransactions(dispatch, store), 10000);
  // ray test touch >

  // // FETCH REDEEM TRANSACTIONS
  fetchRedeemTransactions(dispatch, store);
  window.setInterval(() => fetchRedeemTransactions(dispatch, store), 10000);
}
