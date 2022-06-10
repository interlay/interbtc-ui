
import { web3Accounts } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
// FIXME: name clash for constants so had to use relative path
import * as constants from '@/constants';

const useGetAccounts = (): Array<InjectedAccountWithMeta> => {
  // TODO: this only needs to be done once and should be handled
  // with either state or context, or by wrapping react-query.
  const [accounts, setAccounts] = React.useState<Array<InjectedAccountWithMeta>>([]);

  const { extensions } = useSelector((state: StoreType) => state.general);

  React.useEffect(() => {
    if (!extensions.length) return;

    (async () => {
      try {
        const userAccounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
        setAccounts(userAccounts);
      } catch (error) {
        console.log('[AccountModal] error.message => ', error.message);
      }
    })();
  }, [extensions]);

  return accounts;
};

export default useGetAccounts;
