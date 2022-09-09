import {
  // ray test touch <
  // ActionType,
  // ray test touch >
  ApiStatus,
  // ray test touch <
  // KeyringStatus,
  // ray test touch >
  useSubstrateState
} from '@/substrate-lib/substrate-context';

interface SubstrateLoadingAndErrorHandlingWrapperProps {
  children: React.ReactNode;
}

const SubstrateLoadingAndErrorHandlingWrapper = ({
  children
}: SubstrateLoadingAndErrorHandlingWrapperProps): JSX.Element => {
  const {
    apiStatus,
    apiError,
    // ray test touch <
    // keyringStatus,
    // keyring,
    // ray test touch >
    api
  } = useSubstrateState();

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

  // ray test touch <
  // switch (keyringStatus) {
  //   case KeyringStatus.Idle:
  //   case KeyringStatus.Loading:
  //     // TODO: improve styling
  //     return <>Loading accounts (please review any extension&apos;s authorization)</>;
  //   case KeyringStatus.Ready:
  //     break;
  //   case KeyringStatus.Error:
  //     throw new Error(`${ActionType.SetKeyringError}!`);
  //   default:
  //     throw new Error('Invalid KeyringStatus!');
  // }
  // ray test touch >

  // ray test touch <
  // if (keyring === undefined || api === undefined) {
  //   throw new Error('Something went wrong!');
  // }
  if (api === undefined) {
    throw new Error('Something went wrong!');
  }
  // ray test touch >

  return <>{children}</>;
};

export default SubstrateLoadingAndErrorHandlingWrapper;
