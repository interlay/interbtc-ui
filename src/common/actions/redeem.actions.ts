import { TOGGLE_PREMIUM_REDEEM, TogglePremiumRedeem } from '../types/actions.types';

export const togglePremiumRedeemAction = (premiumRedeem: boolean): TogglePremiumRedeem => ({
  type: TOGGLE_PREMIUM_REDEEM,
  premiumRedeem
});
