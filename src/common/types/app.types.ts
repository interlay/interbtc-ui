import { Signer } from "@polkadot/api/types";

interface AppState {
    accounts?: string[];
    address?: string;
    signer?: Signer;
    showSelectAccount: boolean;
}

export default AppState;
