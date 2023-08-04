import { getWallets } from '@talismn/connect-wallets';
import { useMemo } from 'react';

import { WalletData } from './types';

type UseGetWalletResult = {
  data: {
    available: WalletData[];
    installed: WalletData[];
    hasInstalled: boolean;
  };
};

const useGetWallets = (): UseGetWalletResult => {
  return useMemo(() => {
    const available = getWallets();
    const installed = available.filter((wallet) => wallet.installed);

    return {
      data: {
        available,
        installed,
        hasInstalled: !!installed.length
      }
    };
  }, []);
};

export { useGetWallets };
export type { UseGetWalletResult };
