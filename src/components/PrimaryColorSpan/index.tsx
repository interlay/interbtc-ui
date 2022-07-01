import clsx from 'clsx';

import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';

const PrimaryColorSpan = ({ className, ...rest }: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest}
  />
);

export default PrimaryColorSpan;
