import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';

interface RedeemCancelAction {
  type: Transaction.REDEEM_CANCEL;
  args: Parameters<InterBtcApi['redeem']['cancel']>;
}

interface RedeemBurnAction {
  type: Transaction.REDEEM_BURN;
  args: Parameters<InterBtcApi['redeem']['burn']>;
}

interface RedeemRequestAction {
  type: Transaction.REDEEM_REQUEST;
  args: Parameters<InterBtcApi['redeem']['request']>;
}

type RedeemActions = RedeemRequestAction | RedeemCancelAction | RedeemBurnAction;

export type { RedeemActions };
