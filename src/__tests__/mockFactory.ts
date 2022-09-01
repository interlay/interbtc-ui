import '@testing-library/jest-dom';

jest.mock('@interlay/interbtc-api', () => {
    const actualInterBtcApi = jest.requireActual('@interlay/interbtc-api');

    return {
        ...actualInterBtcApi,
        createInterBtcApi: jest.fn()
    };
});