import clsx from 'clsx';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const ErrorMessage = ({ className, ...rest }: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      { 'text-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'text-xs',
      'px-0.5',
      'py-0.5',
      'h-6',
      'flex',
      'items-center',
      className
    )}
    {...rest}
  />
);

export default ErrorMessage;
