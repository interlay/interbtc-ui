import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";

import {
    ADD_INSTANCE,
    AddInstance,
    AddStakedRelayerInstance,
    ADD_STAKED_RELAYER_INSTANCE,
} from "../types/actions.types";

export const addPolkaBtcInstance = (polkaBtc: PolkaBTCAPI): AddInstance => ({
    type: ADD_INSTANCE,
    polkaBtc,
});

export const addStakedRelayerInstance = (
    stakedRelayer: StakedRelayerClient
): AddStakedRelayerInstance => ({
    type: ADD_STAKED_RELAYER_INSTANCE,
    stakedRelayer,
});
