
import { Dispatch } from 'redux';

import {
  PRICES_URL,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';
import { updateOfPricesAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

const fetchPrices = async (dispatch: Dispatch, store: StoreState): Promise<void> => {
  try {
    const state = store.getState();
    const storePrices = state.general.prices;

    const res = await fetch(PRICES_URL);
    const prices = await res.json();
    // Update the store only if the price is actually changed
    if (
      prices.bitcoin.usd !== storePrices.bitcoin.usd ||
      prices[RELAY_CHAIN_NAME].usd !== storePrices.collateralToken.usd ||
      prices[BRIDGE_PARACHAIN_NAME].usd !== storePrices.governanceToken.usd
    ) {
      dispatch(updateOfPricesAction({
        bitcoin: prices.bitcoin,
        collateralToken: prices[RELAY_CHAIN_NAME],
        governanceToken: prices[BRIDGE_PARACHAIN_NAME]
      }));
    }
  } catch (error) {
    console.log('[fetchPrices] error.message => ', error.message);
  }
};

export default fetchPrices;
