import '@testing-library/jest-dom';

const mockLoadAll = jest.fn();

jest.mock('@polkadot/ui-keyring', () => ({
    keyring: {
        loadAll: mockLoadAll
    }
}));

export { mockLoadAll };
