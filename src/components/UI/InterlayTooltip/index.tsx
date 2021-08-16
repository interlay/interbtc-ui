
import * as React from 'react';
import Tooltip, { TooltipProps } from '@reach/tooltip';
import clsx from 'clsx';
import '@reach/tooltip/styles.css';

type Ref = HTMLDivElement;
const InterlayTooltip = React.forwardRef<Ref, Props>((props, ref): JSX.Element => {
  return (
    <Tooltip
      ref={ref}
      className={clsx(
        'w-max',
        'max-w-xs',
        'p-2.5',
        'rounded-lg',
        'text-xs',
        'backdrop-filter',
        'backdrop-blur-2xl',
        'bg-white',
        'bg-opacity-70',
        'text-textPrimary',
        'border',
        'border-interlayHaiti-100',
        'whitespace-normal',
        'z-interlayTooltip',
        'shadow-md'
      )}
      {...props} />
  );
});
InterlayTooltip.displayName = 'InterlayTooltip';

export type Props = TooltipProps;

export default InterlayTooltip;
