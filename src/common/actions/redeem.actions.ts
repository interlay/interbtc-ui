import {
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_REDEEM_STEP,
    CHANGE_BTC_ADDRESS,
    RESET_REDEEM_WIZARD,
    CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM,
    CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM,
    ADD_TRANSACTION_LISTENER_REDEEM,
    CHANGE_REDEEM_ID,
    ADD_VAULT_REDEEMS,
    SET_REDEEM_REQUESTS,
    ADD_REDEEM_REQUEST,
    UPDATE_REDEEM_REQUEST,
    UPDATE_ALL_REDEEM_REQUESTS,
    CANCEL_REDEEM_REQUEST,
    REDEEM_EXPIRED,
    UpdateAllRedeemRequests,
    ChangeRedeemStep,
    ChangeAmountPolkaBtc,
    ChangeBtcAddress,
    ResetRedeemWizard,
    ChangeVaultBtcAddressOnRedeem,
    ChangeVaultDotAddressOnRedeem,
    AddTransactionListenerRedeem,
    ChangeRedeemId,
    SetRedeemRequests,
    AddRedeemRequest,
    AddVaultRedeems,
    UpdateRedeemRequest,
    CancelRedeemRequest,
    RedeemExpired,
} from "../types/actions.types";
import { RedeemRequest, VaultRedeem } from "../types/redeem.types";

export const changeRedeemStepAction = (step: string): ChangeRedeemStep => ({
    type: CHANGE_REDEEM_STEP,
    step,
});

export const changeAmountPolkaBTCAction = (amount: string): ChangeAmountPolkaBtc => ({
    type: CHANGE_AMOUNT_POLKA_BTC,
    amount,
});

export const changeBTCAddressAction = (btcAddress: string): ChangeBtcAddress => ({
    type: CHANGE_BTC_ADDRESS,
    btcAddress,
});

export const setRedeemRequestsAction = (requests: RedeemRequest[]): SetRedeemRequests => ({
    type: SET_REDEEM_REQUESTS,
    requests,
});

export const resetRedeemWizardAction = (): ResetRedeemWizard => ({
    type: RESET_REDEEM_WIZARD,
});

export const changeVaultBtcAddressOnRedeemAction = (vaultBtcAddress: string): ChangeVaultBtcAddressOnRedeem => ({
    type: CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM,
    vaultBtcAddress,
});

export const changeVaultDotAddressOnRedeemAction = (vaultDotAddress: string): ChangeVaultDotAddressOnRedeem => ({
    type: CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM,
    vaultDotAddress,
});

export const changeRedeemIdAction = (id: string): ChangeRedeemId => ({
    type: CHANGE_REDEEM_ID,
    id,
});

export const addRedeemRequestAction = (request: RedeemRequest): AddRedeemRequest => ({
    type: ADD_REDEEM_REQUEST,
    request,
});

export const addVaultRedeemsAction = (vaultRedeems: VaultRedeem[]): AddVaultRedeems => ({
    type: ADD_VAULT_REDEEMS,
    vaultRedeems,
});

export const addTransactionListenerRedeem = (id: string): AddTransactionListenerRedeem => ({
    type: ADD_TRANSACTION_LISTENER_REDEEM,
    id,
});

export const updateRedeemRequestAction = (request: RedeemRequest): UpdateRedeemRequest => ({
    type: UPDATE_REDEEM_REQUEST,
    request,
});

export const updateAllRedeemRequestsAction = (redeemRequests: RedeemRequest[]): UpdateAllRedeemRequests => ({
    type: UPDATE_ALL_REDEEM_REQUESTS,
    redeemRequests,
});

export const redeemExpiredAction = (request: RedeemRequest): RedeemExpired => ({
    type: REDEEM_EXPIRED,
    request,
});

export const cancelRedeemRequestAction = (id: string): CancelRedeemRequest => ({
    type: CANCEL_REDEEM_REQUEST,
    id,
});
