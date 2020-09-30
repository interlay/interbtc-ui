import { Store, CombinedState } from "redux";
import { AddInstance, AddStakedRelayerInstance } from "./actions.types";
import { PolkaBTCAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { rootReducer } from "../reducers/index";

export interface Prices {
  dotBtc: number;
  dotUsd: number;
}

export type Vault = {
  id: string;
  vault: string;
  btcAddress: string;
  lockedDOT: number;
  lockedBTC: number;
  collateralization: number;
};

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
  api: PolkaBTCAPI;
  relayer: StakedRelayerClient;
  prices: Prices;
};

export type dispatcher = {
  // eslint-disable-next-line
  dispatch: {};
};

export type StoreState = Store<
  CombinedState<StoreType>,
  AddInstance | AddStakedRelayerInstance
> &
  dispatcher;
