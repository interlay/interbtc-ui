import {
    CHANGE_AMOUNT_POLKA_BTC,
    CHANGE_REDEEM_STEP,
    CHANGE_BTC_ADDRESS,
    RESET_REDEEM_WIZARD,
    CHANGE_VAULT_BTC_ADDRESS,
    CHANGE_VAULT_DOT_ADDRESS,
    CHANGE_REDEEM_ID,
    ChangeRedeemStep,
    ChangeAmountPolkaBtc,
    ChangeBtcAddress,
    ResetRedeemWizard,
    ChangeVaultBtcAddress,
    ChangeVaultDotAddress,
    ChangeRedeemId,
} from "../types/actions.types";

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

export const resetRedeemWizardAction = (): ResetRedeemWizard => ({
    type: RESET_REDEEM_WIZARD,
});

export const changeVaultBtcAddressAction = (vaultBtcAddress: string): ChangeVaultBtcAddress => ({
    type: CHANGE_VAULT_BTC_ADDRESS,
    vaultBtcAddress,
});

export const changeVaultDotAddressAction = (vaultDotAddress: string): ChangeVaultDotAddress => ({
    type: CHANGE_VAULT_DOT_ADDRESS,
    vaultDotAddress,
});

export const changeRedeemIdAction = (id: string): ChangeRedeemId => ({
    type: CHANGE_REDEEM_ID,
    id,
});
