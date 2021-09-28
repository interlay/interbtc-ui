
import { Dispatch } from 'redux';

import {
  PRICES_URL,
  COLLATERAL_TOKEN_SYMBOL
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
      prices[COLLATERAL_TOKEN_SYMBOL].usd !== storePrices.collateralToken.usd
    ) {
      dispatch(updateOfPricesAction({
        bitcoin: prices.bitcoin,
        collateralToken: prices[COLLATERAL_TOKEN_SYMBOL]
      }));
    }
  } catch (error) {
    console.log('[fetchPrices] error.message => ', error.message);
  }
};

export default fetchPrices;
