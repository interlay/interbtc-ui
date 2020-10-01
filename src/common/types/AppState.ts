import BTCParachainInterface from "./BTCParachain";
import { KeyringPair } from "@polkadot/keyring/types";
import { StorageInterface, KVStorageInterface } from "./Storage";

interface AppState {
    parachain: BTCParachainInterface;
    account?: KeyringPair;
    address?: string;
    vault: boolean;
    storage?: StorageInterface;
    kvstorage: KVStorageInterface;
}

export default AppState;
