import { Link, LinkProps } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowSmRightIcon } from '@heroicons/react/outline';

import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';

interface CustomProps {
  withArrow?: boolean;
}

const InterlayRouterLink = ({ className, children, withArrow = false, ...rest }: Props): JSX.Element => (
  <Link
    className={clsx(
      { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'space-x-1.5',
      'inline-flex',
      'items-center',
      className
    )}
    {...rest}
  >
    {children}
    {withArrow && <ArrowSmRightIcon className={clsx('w-5', 'h-5')} />}
  </Link>
);

export type Props = LinkProps & CustomProps;

export default InterlayRouterLink;
