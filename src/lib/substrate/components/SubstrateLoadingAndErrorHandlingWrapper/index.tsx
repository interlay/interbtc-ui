import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import { isBridgeLoaded } from '@/common/actions/general.actions';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import { useSubstrateState } from '@/lib/substrate/context/hooks';
import { ActionType, ApiStatus, KeyringStatus } from '@/lib/substrate/context/types';
import InterlayHelmet from '@/parts/InterlayHelmet';

interface SubstrateLoadingAndErrorHandlingWrapperProps {
  children: React.ReactNode;
}

const SubstrateLoadingAndErrorHandlingWrapper = ({
  children
}: SubstrateLoadingAndErrorHandlingWrapperProps): JSX.Element => {
  const dispatch = useDispatch();

  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState();

  // TODO: translate `FullLoadingSpinner` texts once confirmed
  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      return <FullLoadingSpinner text='Connecting to Bridge' />;
    case ApiStatus.Ready:
      // TODO: remove `isBridgeLoaded` & `bridgeLoaded` use cases via another PR
      dispatch(isBridgeLoaded(true));
      break;
    case ApiStatus.Error:
      if (apiError === undefined) {
        throw new Error('Something went wrong!');
      }
      toast.warn('Unable to connect to the BTC-Parachain.');
      return (
        <FullLoadingSpinner
          text={`Error Connecting to Bridge: Connection to websocket ${apiError.target.url} failed.`}
        />
      );
    case ApiStatus.Disconnected:
      return <FullLoadingSpinner text='Disconnected from Bridge' />;
    default:
      throw new Error('Invalid ApiStatus!');
  }

  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      return <FullLoadingSpinner text="Loading accounts (please review any extension's authorization)" />;
    case KeyringStatus.Ready:
      break;
    case KeyringStatus.Error:
      throw new Error(`${ActionType.SetKeyringError}!`);
    default:
      throw new Error('Invalid KeyringStatus!');
  }

  if (keyring === undefined) {
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
