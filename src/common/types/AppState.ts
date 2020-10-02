import { Signer } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";
import BTCParachainInterface from "./BTCParachain";
import { KVStorageInterface, StorageInterface } from "./Storage";

interface AppState {
    parachain: BTCParachainInterface;
    account?: KeyringPair;
    address?: string;
    signer?: Signer;
    vault: boolean;
    storage?: StorageInterface;
    kvstorage: KVStorageInterface;
    resetRedeemWizard?: () => void;
}

export default AppState;
