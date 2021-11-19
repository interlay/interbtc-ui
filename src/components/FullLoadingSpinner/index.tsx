
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';

const FullLoadingSpinner = (): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'justify-center',
      'items-center',
      'absolute',
      'top-0',
      'left-0',
      'w-full',
      'h-full'
    )}>
    <SpinIcon
      className={clsx(
        { 'text-interlayDenim':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'animate-spin',
        'w-9',
        'h-9'
      )} />
  </div>
);

export default FullLoadingSpinner;
