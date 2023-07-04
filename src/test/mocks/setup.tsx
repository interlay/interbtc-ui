import './@interlay/interbtc-api';
import './@polkadot/api';
import './@polkadot/extension-dapp';
import './@polkadot/ui-keyring';
import './fetch';
import './hooks';
import './intersectionObserver';
import './substrate';

import { createInterBtcApi } from '@interlay/interbtc-api';
import { FocusScope } from '@react-aria/focus';
import ReactDOM from 'react-dom';

// Enforce garbage collection
afterAll(() => {
  if (global.gc) global.gc();
});

// Removing transaction modal from showing on every single test
jest.mock('@/utils/hooks/transaction/use-transaction-notifications', () => ({
  useTransactionNotifications: () => ({ onReject: jest.fn(), mutationProps: {} })
}));

// MEMO: mocking @react/aria overlay component because
// of a error around `createTreeWalker`
const mockOverlay: React.FC = ({ children, isOpen }: any) =>
  isOpen
    ? ReactDOM.createPortal(
        <FocusScope autoFocus contain restoreFocus>
          {children}
        </FocusScope>,
        document.body
      )
    : null;
jest.mock('@/component-library/Overlay', () => {
  mockOverlay.displayName = 'mockOverlay';
  return { Overlay: mockOverlay };
});

// Pre-create API and assign to window to avoid waiting for substrate provider to be loaded before.
// Does not need any parameters since lib instance is mocked.
const precreateApiInstance = async () => {
  window.bridge = await createInterBtcApi('');
};
precreateApiInstance();

if (!process.env?.REACT_APP_RELAY_CHAIN_NAME) {
  throw new Error('Please make sure you have created .env.test file with the necessary env variables');
}
