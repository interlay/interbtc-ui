
import {
  RedeemActions,
  TOGGLE_PREMIUM_REDEEM
} from '../types/actions.types';
import { RedeemState } from '../types/redeem.types';

const initialState = {
  premiumRedeem: false
};

export const redeemReducer = (state: RedeemState = initialState, action: RedeemActions): RedeemState => {
  switch (action.type) {
  case TOGGLE_PREMIUM_REDEEM:
    return { ...state, premiumRedeem: action.premiumRedeem };
  default:
    return state;
  }
};
