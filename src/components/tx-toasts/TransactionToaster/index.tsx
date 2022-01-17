
import {
  Toaster,
  ToastPosition,
  ToastOptions
} from 'react-hot-toast';
import clsx from 'clsx';

import { TXToastInfoSetProvider } from 'contexts/tx-toast-info-set-context';
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
  <TXToastInfoSetProvider>
    <Toaster
      position={position || 'top-right'}
      containerClassName={styles.interlayToasterContainer}
      toastOptions={{
        style: {
          background: 'none'
        },
        className: clsx(
          'z-interlaySnackbar',
          '!shadow-none',
          '!rounded-lg',
          '!p-0',
          '!text-current',
          'backdrop-filter',
          'backdrop-blur-2xl'
        ),
        ...toastOptions
      }} />
  </TXToastInfoSetProvider>
);

export default TransactionToaster;
