import { newAccountId, createInterBtcApi, createSubstrateAPI, newMonetaryAmount } from '@interlay/interbtc-api';
import { Keyring } from '@polkadot/api';

const testFund = async (): Promise<void> => {
  const testApi = await createInterBtcApi(
    process.env.REACT_APP_PARACHAIN_URL,
    'testnet'
  );

  const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
  const defaultAccountKeyring = keyring.addFromUri(process.env.REACT_APP_DEFAULT_ACCOUNT as string);

  const callWith = async (
    InterBtcApi: any,
    key: any,
    call: any
  ): Promise<any> => {
    const prevKey = InterBtcApi.account;
    InterBtcApi.setAccount(key);

    let result;

    try {
      result = await call();
    // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      if (prevKey) InterBtcApi.setAccount(prevKey);
    }
    return result;
  };

  const sudo = (InterBtcApi: any, call: any): Promise<any> => {
    const keyring = new Keyring({ type: 'sr25519' });
    const rootKey = keyring.addFromUri(process.env.REACT_APP_SUDO_ACCOUNT);
    return callWith(InterBtcApi, rootKey, call);
  };

  const api = await createSubstrateAPI(process.env.REACT_APP_PARACHAIN_URL);

  await sudo(
    testApi,
    () => testApi.tokens.setBalance(
      newAccountId(api, defaultAccountKeyring.address),
      newMonetaryAmount(1000, testApi.getGovernanceCurrency(), true)
    )
  );
};

export default testFund;
