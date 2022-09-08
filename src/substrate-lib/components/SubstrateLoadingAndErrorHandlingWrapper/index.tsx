// ray test touch <<
import { ActionType, ApiStatus, KeyringStatus, useSubstrateState } from '@/substrate-lib/substrate-context';

interface SubstrateLoadingAndErrorHandlingWrapperProps {
  children: React.ReactNode;
}

const SubstrateLoadingAndErrorHandlingWrapper = ({
  children
}: SubstrateLoadingAndErrorHandlingWrapperProps): JSX.Element => {
  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      // TODO: improve styling
      return <>Connecting to Substrate</>;
    case ApiStatus.Ready:
      break;
    case ApiStatus.Error:
      if (apiError === undefined) {
        throw new Error('Something went wrong!');
      }
      // TODO: improve styling
      return <>Error Connecting to Substrate: Connection to websocket {apiError.target.url} failed.</>;
    case ApiStatus.Disconnected:
      // TODO: improve styling
      return <>Disconnected from Substrate</>;
    default:
      throw new Error('Invalid ApiStatus!');
  }

  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      // TODO: improve styling
      return <>Loading accounts (please review any extension&apos;s authorization)</>;
    case KeyringStatus.Ready:
      break;
    case KeyringStatus.Error:
      throw new Error(`${ActionType.SetKeyringError}!`);
    default:
      throw new Error('Invalid KeyringStatus!');
  }

  if (keyring === undefined || api === undefined) {
    throw new Error('Something went wrong!');
  }

  return <>{children}</>;
};

export default SubstrateLoadingAndErrorHandlingWrapper;
// ray test touch >>
