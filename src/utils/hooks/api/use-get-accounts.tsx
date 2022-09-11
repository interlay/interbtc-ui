import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { useSubstrateSecureState } from '@/substrate-lib/substrate-context';

const useGetAccounts = (): Array<InjectedAccountWithMeta> => {
  // ray test touch <<
  const { accounts } = useSubstrateSecureState();
  // TODO: this only needs to be done once and should be handled
  // with either state or context, or by wrapping react-query.
  // const [accounts, setAccounts] = React.useState<Array<InjectedAccountWithMeta>>([]);
  // const { extensions } = useSelector((state: StoreType) => state.general);
  // React.useEffect(() => {
  //   if (!extensions.length) return;
  //   (async () => {
  //     try {
  //       const userAccounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
  //       setAccounts(userAccounts);
  //     } catch (error) {
  //       console.log('[AccountModal] error.message => ', error.message);
  //     }
  //   })();
  // }, [extensions]);
  // ray test touch >>

  return accounts;
};

export default useGetAccounts;
