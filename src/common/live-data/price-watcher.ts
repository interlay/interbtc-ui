import { Dispatch } from 'redux';

import { PRICES_URL } from 'config/relay-chains';
import { Prices } from '../types/util.types';
import { updateOfPricesAction } from '../actions/general.actions';
import { StoreState } from '../types/util.types';

export default function fetchPrices(dispatch: Dispatch, store: StoreState): void {
  const state = store.getState();
  const storePrices = state.general.prices;

  fetch(PRICES_URL)
    .then(response => {
      return response.json() as Promise<Prices>;
    })
    .then(prices => {
      try {
        // Update the store only if the price is actually changed
        if (
          prices.bitcoin.usd !== storePrices.bitcoin.usd ||
          prices.collateralToken.usd !== storePrices.collateralToken.usd
        ) {
          dispatch(updateOfPricesAction(prices));
        }
      } catch (error) {
        console.log(error);
      }
    });
}
