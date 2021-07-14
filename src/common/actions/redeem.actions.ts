import { Redeem } from '@interlay/interbtc';
import {
  RESET_REDEEM_WIZARD,
  SET_REDEEM_REQUESTS,
  ADD_REDEEM_REQUEST,
  UPDATE_REDEEM_REQUEST,
  UPDATE_ALL_REDEEM_REQUESTS,
  RETRY_REDEEM_REQUEST,
  REDEEM_EXPIRED,
  REIMBURSE_REDEEM_REQUEST,
  TOGGLE_PREMIUM_REDEEM,
  TogglePremiumRedeem,
  UpdateAllRedeemRequests,
  ResetRedeemWizard,
  SetRedeemRequests,
  AddRedeemRequest,
  UpdateRedeemRequest,
  RetryRedeemRequest,
  RedeemExpired,
  ReimburseRedeemRequest
} from '../types/actions.types';

export const setRedeemRequestsAction = (requests: Redeem[]): SetRedeemRequests => ({
  type: SET_REDEEM_REQUESTS,
  requests
});

export const resetRedeemWizardAction = (): ResetRedeemWizard => ({
  type: RESET_REDEEM_WIZARD
});

export const addRedeemRequestAction = (request: Redeem): AddRedeemRequest => ({
  type: ADD_REDEEM_REQUEST,
  request
});

export const updateRedeemRequestAction = (request: Redeem): UpdateRedeemRequest => ({
  type: UPDATE_REDEEM_REQUEST,
  request
});

export const updateAllRedeemRequestsAction = (
  userDotAddress: string,
  redeemRequests: Redeem[]
): UpdateAllRedeemRequests => ({
  type: UPDATE_ALL_REDEEM_REQUESTS,
  userDotAddress,
  redeemRequests
});

export const redeemExpiredAction = (request: Redeem): RedeemExpired => ({
  type: REDEEM_EXPIRED,
  request
});

export const retryRedeemRequestAction = (id: string): RetryRedeemRequest => ({
  type: RETRY_REDEEM_REQUEST,
  id
});

export const reimburseRedeemRequestAction = (id: string): ReimburseRedeemRequest => ({
  type: REIMBURSE_REDEEM_REQUEST,
  id
});

export const togglePremiumRedeemAction = (premiumRedeem: boolean): TogglePremiumRedeem => ({
  type: TOGGLE_PREMIUM_REDEEM,
  premiumRedeem
});
