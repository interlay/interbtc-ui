import clsx from 'clsx';
import { forwardRef } from 'react';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { BORDER_CLASSES } from '@/utils/constants/styles';

const Panel = forwardRef<HTMLDivElement, Props>(
  ({ className, ...rest }: Props, ref): JSX.Element => (
    <div
      ref={ref}
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
  )
);

Panel.displayName = 'Panel';

export type Props = React.ComponentPropsWithRef<'div'>;

export default Panel;
