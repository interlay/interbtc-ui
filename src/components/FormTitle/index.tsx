
import clsx from 'clsx';

import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';

const FormTitle = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h4'>): JSX.Element => (
  <h4
    className={clsx(
      'font-medium',
      'text-center',
      { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiOchre':
        process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      className
    )}
    {...rest}>
    {children}
  </h4>
);

export default FormTitle;
