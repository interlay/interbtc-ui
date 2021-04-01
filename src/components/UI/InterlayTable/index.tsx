
import * as React from 'react';

import clsx from 'clsx';

const InterlayTableContainer = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'overflow-x-auto',
      className
    )}
    {...rest} />
);

const InterlayTable = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'table'>) => (
  <table
    className={clsx(
      'w-full',
      className
    )}
    {...rest} />
);

const InterlayThead = (props: React.ComponentPropsWithRef<'thead'>) => (
  <thead {...props} />
);

const InterlayTbody = (props: React.ComponentPropsWithRef<'tbody'>) => (
  <tbody {...props} />
);

const InterlayTr = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'tr'>) => (
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
    {...rest} />
);

const InterlayTh = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'th'>) => (
  <th
    className={clsx(
      'text-secondary',
      'text-base',
      'p-2',
      className
    )}
    {...rest} />
);

const InterlayTd = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'td'>) => (
  <td
    className={clsx(
      'h-12',
      'p-2',
      className
    )}
    {...rest} />
);

export {
  InterlayTableContainer,
  InterlayThead,
  InterlayTbody,
  InterlayTr,
  InterlayTh,
  InterlayTd
};

export default InterlayTable;
