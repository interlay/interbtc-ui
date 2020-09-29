import { PolkaBTCAPI } from "@interlay/polkabtc";

import { ADD_INSTANCE, AddInstance } from "../types/actions.types";

export const addPolkaBtcInstance = (polkaBtc: PolkaBTCAPI): AddInstance => ({
    type: ADD_INSTANCE,
    polkaBtc
});