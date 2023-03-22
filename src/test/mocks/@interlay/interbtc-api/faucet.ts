const mockFundAccount = jest.fn();

const mockFaucet = jest.fn().mockImplementation(() => ({ fundAccount: mockFundAccount }));

export { mockFaucet };
