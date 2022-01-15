
// ray test touch <<
import {
  Toaster,
  ToastPosition,
  ToastOptions
} from 'react-hot-toast';
import clsx from 'clsx';

import { CountProvider } from 'contexts/count-context';
import styles from './transaction-toaster.module.css';

interface Props {
  position?: ToastPosition;
  toastOptions?: ToastOptions;
}

// MEMO: could use `https://docs.blocknative.com/notify`
const TransactionToaster = ({
  position,
  toastOptions
}: Props): JSX.Element => (
  <CountProvider>
    <Toaster
      position={position || 'top-right'}
      containerClassName={styles.farmersOnlyToasterContainer}
      toastOptions={{
        style: {
          background: 'none'
        },
        className: clsx(
          'z-farmersOnlySnackbar',
          '!shadow-none',
          '!rounded-lg',
          '!p-0',
          '!text-current',
          'backdrop-filter',
          'backdrop-blur-2xl'
        ),
        ...toastOptions
      }} />
  </CountProvider>
);

export default TransactionToaster;
// ray test touch >>
