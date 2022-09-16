import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import { isBridgeLoaded } from '@/common/actions/general.actions';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import InterlayHelmet from '@/parts/InterlayHelmet';
import { ActionType, ApiStatus, KeyringStatus, useSubstrateState } from '@/substrate-lib/substrate-context';

interface SubstrateLoadingAndErrorHandlingWrapperProps {
  children: React.ReactNode;
}

const SubstrateLoadingAndErrorHandlingWrapper = ({
  children
}: SubstrateLoadingAndErrorHandlingWrapperProps): JSX.Element => {
  const dispatch = useDispatch();

  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      // ray test touch <<
      return <FullLoadingSpinner text='Connecting to Bridge' />;
    // ray test touch >>
    case ApiStatus.Ready:
      // TODO: remove `isBridgeLoaded` & `bridgeLoaded` use cases via another PR
      dispatch(isBridgeLoaded(true));
      break;
    case ApiStatus.Error:
      if (apiError === undefined) {
        throw new Error('Something went wrong!');
      }
      toast.warn('Unable to connect to the BTC-Parachain.');
      // ray test touch <<
      // TODO: improve styling
      return (
        <FullLoadingSpinner
          text={`Error Connecting to Bridge: Connection to websocket ${apiError.target.url} failed.`}
        />
      );
    // ray test touch >>
    case ApiStatus.Disconnected:
      // ray test touch <<
      // TODO: improve styling
      return <FullLoadingSpinner text='Disconnected from Bridge' />;
    // ray test touch >>
    default:
      throw new Error('Invalid ApiStatus!');
  }

  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      // ray test touch <<
      // TODO: improve styling
      return <FullLoadingSpinner text="Loading accounts (please review any extension's authorization)" />;
    // ray test touch >>
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
  if (api === undefined) {
    throw new Error('Something went wrong!');
  }

  return (
    <>
      <InterlayHelmet />
      <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />
      {children}
    </>
  );
};

export default SubstrateLoadingAndErrorHandlingWrapper;
