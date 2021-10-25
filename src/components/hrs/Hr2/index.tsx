
import clsx from 'clsx';

import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';

const Hr2 = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'hr'>): JSX.Element => (
  <hr
    className={clsx(
      { 'border-interlayTextSecondaryInLightMode':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      { 'dark:border-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest} />
);

export default Hr2;
