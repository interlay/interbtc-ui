import { useLocalStorage as useLibLocalStorage } from 'react-use';

enum LocalStorageKey {
  TC_SIGNATURES = 'TC_SIGNATURES'
}

type TCSignaturesData = Record<string, boolean>;

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
const useLocalStorage = <T = unknown>(key: LocalStorageKey, initialValue?: T, options?: Options<T>) =>
  useLibLocalStorage(key, initialValue, options);

export { LocalStorageKey, useLocalStorage };
export type { TCSignaturesData };
