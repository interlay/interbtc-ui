// ray test touch <
import {
  ActionType,
  ApiStatus,
  KeyringStatus,
  SubstrateProvider,
  useSubstrateState
} from '@/substrate-lib/substrate-context';

const Main = () => {
  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      return <>Connecting to Substrate</>;
    case ApiStatus.Ready:
      break;
    case ApiStatus.Error:
      if (apiError === null) {
        throw new Error('Something went wrong!');
      }
      return <>Error Connecting to Substrate: Connection to websocket {apiError.target.url} failed.</>;
    default:
      throw new Error('Invalid ApiStatus!');
  }

  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      return <>Loading accounts (please review any extension&apos;s authorization)</>;
    case KeyringStatus.Ready:
      break;
    case KeyringStatus.Error:
      throw new Error(`${ActionType.SetKeyringError}!`);
    default:
      throw new Error('Invalid KeyringStatus!');
  }

  if (keyring === null || api === null) {
    throw new Error('Something went wrong!');
  }

  return <>Main</>;
};

// http://localhost:3000/?rpc=wss://api-dev-kintsugi.interlay.io/parachain
const SubstrateContextDemo = (): JSX.Element => {
  return (
    <SubstrateProvider>
      <Main />
    </SubstrateProvider>
  );
};

export default SubstrateContextDemo;
// ray test touch >
