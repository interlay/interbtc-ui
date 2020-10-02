import { CHANGE_AMOUNT_POLKA_BTC, CHANGE_REEDEM_STEP, CHANGE_BTC_ADDRESS, RESET_REDEEM_WIZARD,
    ChangeRedeemStep, ChangeAmountPolkaBtc, ChangeBtcAddress, ResetRedeemWizard } from "../types/actions.types";

export const changeRedeemStepAction = (step: string): ChangeRedeemStep => ({
    type: CHANGE_REEDEM_STEP,
    step,
});

export const changeAmountPolkaBTCAction = (amount: number): ChangeAmountPolkaBtc => ({
    type: CHANGE_AMOUNT_POLKA_BTC,
    amount
});

export const changeBTCAddressAction = (btcAddress: string): ChangeBtcAddress => ({
    type: CHANGE_BTC_ADDRESS,
    btcAddress
});

export const resetRedeemWizardAction = (): ResetRedeemWizard => ({
    type: RESET_REDEEM_WIZARD,
})