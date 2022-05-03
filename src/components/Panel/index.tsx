
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';

const Panel = ({
  className,
  ...rest
}: Props): JSX.Element => (
  <div
    className={clsx(
      'shadow',
      'overflow-hidden',
      'sm:rounded-lg',
      { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      // ray test touch <<
      'border',
      LIGHT_DARK_BORDER_CLASSES,
      // ray test touch >>
      className
    )}
    {...rest} />
);

export type Props = React.ComponentPropsWithRef<'div'>;

export default Panel;
