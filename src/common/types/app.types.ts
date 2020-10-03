import { Signer } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";

interface AppState {
    account?: KeyringPair;
    address?: string;
    signer?: Signer;
    resetRedeemWizard?: () => void;
}

export default AppState;
