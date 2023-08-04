import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { APP_NAME } from '@/config/relay-chains';

import { WalletData } from './types';

const enableFn = async (wallet: WalletData): Promise<WalletData> => {
  await wallet.enable(APP_NAME);

  return wallet;
};

type UseEnableWalletOptions = Omit<
  UseMutationOptions<WalletData, unknown, WalletData, unknown>,
  'mutationKey' | 'mutationFn'
>;

type UseEnableWalletResult = UseMutationResult<WalletData, unknown, WalletData, unknown>;

const useEnableWallet = (provider?: string, options?: UseEnableWalletOptions): UseEnableWalletResult =>
  useMutation(['web3Enable', provider], enableFn, options);

export { useEnableWallet };
export type { UseEnableWalletOptions, UseEnableWalletResult };
