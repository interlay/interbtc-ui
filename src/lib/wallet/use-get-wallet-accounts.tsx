import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { WalletAccountData, WalletData } from './types';

const getAccountsFn = async (wallet: WalletData) => wallet.getAccounts();

type UseGetWalletAccountsOptions = Omit<
  UseMutationOptions<WalletAccountData[], unknown, WalletData, unknown>,
  'mutationKey' | 'mutationFn'
>;

type UseGetWalletAccountsResult = UseMutationResult<WalletAccountData[], unknown, WalletData, unknown>;

const useGetWalletAccounts = (provider?: string, options?: UseGetWalletAccountsOptions): UseGetWalletAccountsResult =>
  useMutation(['accounts', provider], getAccountsFn, options);

export { useGetWalletAccounts };
export type { UseGetWalletAccountsOptions, UseGetWalletAccountsResult };
