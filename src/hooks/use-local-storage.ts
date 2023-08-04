import { useLocalStorage as useLibLocalStorage } from 'react-use';

import { WalletAccountData } from '@/lib/wallet/types';

enum LocalStorageKey {
  TC_SIGNATURES = 'TC_SIGNATURES',
  WALLET_WELCOME_BANNER = 'WALLET_WELCOME_BANNER',
  WALLET_ACCOUNT = 'WALLET_ACCOUNT'
}

type LocalStorageValueTypes = {
  [LocalStorageKey.TC_SIGNATURES]: { [account: string]: { version: string; isSigned: boolean } | boolean };
  [LocalStorageKey.WALLET_WELCOME_BANNER]: boolean;
  [LocalStorageKey.WALLET_ACCOUNT]: WalletAccountData;
};

type Options<T = unknown> =
  | {
      raw: true;
    }
  | {
      raw: false;
      serializer: (value: T) => string;
      deserializer: (value: string) => T;
    }
  | undefined;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useLocalStorage = <T extends keyof LocalStorageValueTypes>(
  key: T,
  initialValue?: LocalStorageValueTypes[T],
  options?: Options<LocalStorageValueTypes[T]>
) => useLibLocalStorage<LocalStorageValueTypes[T]>(key, initialValue, options);

export { LocalStorageKey, useLocalStorage };
