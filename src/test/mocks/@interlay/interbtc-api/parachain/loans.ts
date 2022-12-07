import { CurrencyExt } from '@interlay/interbtc-api';

const DEFAULT_LEND_TOKENS: CurrencyExt[] = [];

const mockGetLendTokens = jest.fn(() => DEFAULT_LEND_TOKENS);

export { mockGetLendTokens };
