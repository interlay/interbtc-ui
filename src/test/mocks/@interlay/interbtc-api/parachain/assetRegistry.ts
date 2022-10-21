import { CurrencyExt } from "@interlay/interbtc-api";

const DEFAULT_FOREIGN_ASSETS: CurrencyExt[] = [];

const mockGetForeignAssets = jest.fn(() => DEFAULT_FOREIGN_ASSETS);

export { mockGetForeignAssets };
