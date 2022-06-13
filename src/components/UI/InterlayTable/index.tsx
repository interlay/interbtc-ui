import clsx from 'clsx';
import * as React from 'react';

import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

const InterlayTableContainer = ({ className, ...rest }: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div className={clsx('overflow-x-auto', 'overflow-y-hidden', className)} {...rest} />
);

const InterlayTable = ({ className, ...rest }: React.ComponentPropsWithRef<'table'>): JSX.Element => (
  <table className={clsx('w-full', className)} {...rest} />
);

const InterlayThead = (props: React.ComponentPropsWithRef<'thead'>): JSX.Element => <thead {...props} />;

const InterlayTbody = (props: React.ComponentPropsWithRef<'tbody'>): JSX.Element => <tbody {...props} />;

const InterlayTr = ({ className, ...rest }: React.ComponentPropsWithRef<'tr'>): JSX.Element => (
  <tr
    className={clsx(
      'border-b',
      'border-l-0',
      'border-r-0',
      'border-t-0',
      'border-solid',
      'border-gray-300', // TODO: should update per design
      'text-sm',
      className
    )}
    {...rest}
  />
);

const InterlayTh = ({ className, ...rest }: React.ComponentPropsWithRef<'th'>): JSX.Element => (
  <th
    className={clsx(
      { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'text-base',
      'p-2',
      className
    )}
    {...rest}
  />
);

const InterlayTd = ({ className, ...rest }: React.ComponentPropsWithRef<'td'>): JSX.Element => (
  <td className={clsx('h-12', 'p-2', className)} {...rest} />
);

export { InterlayTableContainer, InterlayTbody, InterlayTd,InterlayTh, InterlayThead, InterlayTr };

export default InterlayTable;
