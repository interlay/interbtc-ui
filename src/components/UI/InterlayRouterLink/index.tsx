import { ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Link, LinkProps } from 'react-router-dom';

import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

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
    {withArrow && <ArrowSmallRightIcon className={clsx('w-5', 'h-5')} />}
  </Link>
);

export type Props = LinkProps & CustomProps;

export default InterlayRouterLink;
