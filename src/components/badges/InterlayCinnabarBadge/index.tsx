
import * as React from 'react';
import clsx from 'clsx';

type Ref = HTMLSpanElement;
const InterlayCinnabarBadge = React.forwardRef<Ref, Props>(({
  className,
  ...rest
}, ref): JSX.Element => (
  <span
    ref={ref}
    className={clsx(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium',
      'bg-interlayCinnabar-100',
      'text-interlayCinnabar-800',
      className
    )}
    {...rest} />
));
InterlayCinnabarBadge.displayName = 'InterlayCinnabarBadge';

export type Props = React.ComponentPropsWithRef<'span'>;

export default InterlayCinnabarBadge;
