import clsx from 'clsx';
import * as React from 'react';

import InterlayRouterLink, { Props as InterlayRouterLinkProps } from '@/components/UI/InterlayRouterLink';
import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

const StatsDt = ({ className, ...rest }: React.ComponentPropsWithRef<'dt'>): JSX.Element => (
  <dt
    className={clsx(
      { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'text-sm',
      'font-medium',
      className
    )}
    {...rest}
  />
);

const StatsDd = ({ className, ...rest }: React.ComponentPropsWithRef<'dd'>): JSX.Element => (
  <dd className={clsx('text-lg', 'font-semibold', className)} {...rest} />
);

const StatsRouterLink = ({ className, to, ...rest }: InterlayRouterLinkProps): JSX.Element => (
  <InterlayRouterLink
    className={clsx('text-sm', 'font-medium', 'hover:underline', className)}
    to={to}
    withArrow
    {...rest}
  />
);

interface StatsCustomProps {
  leftPart?: React.ReactNode;
  rightPart?: React.ReactNode;
}

type StatsProps = StatsCustomProps & React.ComponentPropsWithRef<'div'>;

const Stats = ({ leftPart, rightPart }: StatsProps): JSX.Element => (
  <div className={clsx('flex', 'justify-between')}>
    <div className={clsx('space-y-0.5', 'flex-shrink-0')}>{leftPart}</div>
    <div className={clsx('inline-flex', 'flex-col', 'items-end', 'space-y-1')}>{rightPart}</div>
  </div>
);

export { StatsDd, StatsDt, StatsRouterLink };

export default Stats;
