import './@interlay/interbtc-api';
import './@polkadot/api';
import './@polkadot/extension-dapp';
import './@polkadot/ui-keyring';
import './fetch';
import './intersectionObserver';
import './substrate';
import './utils';
import './hooks';

import { createInterBtcApi } from '@interlay/interbtc-api';
import { FocusScope } from '@react-aria/focus';
import ReactDOM from 'react-dom';

import { TransactionEvents } from '@/utils/hooks/transaction/types';

// Enforce garbage collection
afterAll(() => {
  if (global.gc) global.gc();
});

jest.mock('@/utils/hooks/transaction/utils/submit', () => ({
  submitTransaction: (
    _api: any,
    _account: any,
    _extrinsicData: any,
    _expectedStatus: any,
    callbacks?: TransactionEvents
  ) => {
    callbacks?.onReady?.();
    return { status: 'success', data: {} as any };
  }
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
