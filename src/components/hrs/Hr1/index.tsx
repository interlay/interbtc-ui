
import clsx from 'clsx';

import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';

const Hr1 = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'hr'>): JSX.Element => (
  <hr
    className={clsx(
      { 'border-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      { 'dark:border-kintsugiSupernova-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest} />
);

export default Hr1;
