import "@testing-library/jest-dom"

import { DEFAULT_ADDRESS } from "../constants";

const mockKeyring = jest.fn(function () {
    return { addFromUri: (_seed: string) => ({ address: DEFAULT_ADDRESS }) };
}
)

jest.mock('@polkadot/api', () => {
    const actualApi = jest.requireActual('@polkadot/api');

    return {
        ...actualApi,
        Keyring: mockKeyring
    }
});

export { mockKeyring }