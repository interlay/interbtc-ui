
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

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
      // ray test touch <
      'border',
      // TODO: could be reused
      // MEMO: inspired by https://mui.com/components/buttons/
      'border-black',
      'border-opacity-25',
      'dark:border-white',
      'dark:border-opacity-25',
      // ray test touch >
      className
    )}
    {...rest} />
);

export type Props = React.ComponentPropsWithRef<'div'>;

export default Panel;
