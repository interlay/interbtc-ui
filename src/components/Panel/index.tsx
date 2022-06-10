import clsx from 'clsx';

import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';
import { BORDER_CLASSES } from '@/utils/constants/styles';

const Panel = ({ className, ...rest }: Props): JSX.Element => (
  <div
    className={clsx(
      'shadow',
      'overflow-hidden',
      'sm:rounded-lg',
      { 'bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      BORDER_CLASSES,
      className
    )}
    {...rest}
  />
);

export type Props = React.ComponentPropsWithRef<'div'>;

export default Panel;
