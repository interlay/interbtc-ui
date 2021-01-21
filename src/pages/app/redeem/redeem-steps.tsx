import React from "react";
import EnterPolkaBTCAmount from "./enter-polkabtc-amount";
import EnterBTCAddress from "./enter-btc-address";
import Confirmation from "./confirmation";
import VaultInfo from "./vault-info";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";


export default function RedeemSteps () {
    const step = useSelector((state: StoreType)=> state.redeem.step);

    return <div className="redeem-steps">
        {step === "ENTER_POLKABTC" && <EnterPolkaBTCAmount/>}
        {step === "ENTER_BTC_ADDRESS" && <EnterBTCAddress/>}
        {step === "CONFIRMATION" && <Confirmation/>}
        {step === "VAULT_INFO" && <VaultInfo/>}
    </div>
}
