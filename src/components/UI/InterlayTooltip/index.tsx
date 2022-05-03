
import * as React from 'react';
import Tooltip, { TooltipProps } from '@reach/tooltip';
import clsx from 'clsx';
import '@reach/tooltip/styles.css';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
// ray test touch <<
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
// ray test touch >>

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
        { 'dark:bg-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        // ray test touch <<
        'border',
        LIGHT_DARK_BORDER_CLASSES,
        // ray test touch >>

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
