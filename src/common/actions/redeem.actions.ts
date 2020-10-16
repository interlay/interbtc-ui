import {
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_REDEEM_STEP,
    CHANGE_BTC_ADDRESS,
    RESET_REDEEM_WIZARD,
    CHANGE_VAULT_BTC_ADDRESS_ON_REDEEM,
    CHANGE_VAULT_DOT_ADDRESS_ON_REDEEM,
    CHANGE_REDEEM_ID,
    SET_REDEEM_REQUESTS,
    ADD_REDEEM_REQUEST,
    ChangeRedeemStep,
    ChangeAmountPolkaBtc,
    ChangeBtcAddress,
    ResetRedeemWizard,
    ChangeVaultBtcAddressOnRedeem,
    ChangeVaultDotAddressOnRedeem,
    ChangeRedeemId,
    SetRedeemRequests,
    AddRedeemRequest,
} from "../types/actions.types";
import { RedeemRequest } from "../types/redeem.types";

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
