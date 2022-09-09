import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import { isBridgeLoaded } from '@/common/actions/general.actions';
import InterlayHelmet from '@/parts/InterlayHelmet';
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
  const dispatch = useDispatch();

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
      // ray test touch <
      // TODO: remove `isBridgeLoaded` & `bridgeLoaded` use cases via another PR
      dispatch(isBridgeLoaded(true));
      // ray test touch >
      break;
    case ApiStatus.Error:
      if (apiError === undefined) {
        throw new Error('Something went wrong!');
      }
      toast.warn('Unable to connect to the BTC-Parachain.');
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

  return (
    <>
      <InterlayHelmet />
      <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />
      {children}
    </>
  );
};

export default SubstrateLoadingAndErrorHandlingWrapper;
