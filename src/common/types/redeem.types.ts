import { Redeem } from '@interlay/interbtc';

export interface RedeemState {
  // TODO: use current account from general state
  address: string;
  // current step in the wizard
  step: string;
  // id of the current request
  id: string;
  // true if premium redeem is selected
  premiumRedeem: boolean;
  // mapping of all redeem requests
  redeemRequests: Map<string, Redeem[]>;
}
