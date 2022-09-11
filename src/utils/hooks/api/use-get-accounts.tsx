import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { useSubstrateSecureState } from '@/substrate-lib/substrate-context';

const useGetAccounts = (): Array<InjectedAccountWithMeta> => {
  const { accounts } = useSubstrateSecureState();

  return accounts;
};

export default useGetAccounts;
