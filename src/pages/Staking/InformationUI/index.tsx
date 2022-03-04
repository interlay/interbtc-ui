
import clsx from 'clsx';

import InterlayTooltip from 'components/UI/InterlayTooltip';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface CustomProps {
  label: string;
  value: string | number;
  tooltip: string;
}

const InformationUI = ({
  label,
  value,
  tooltip,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex',
        'justify-between',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'inline-flex',
          'items-center',
          'space-x-3'
        )}>
        <span
          className={clsx(
            // TODO: placeholder color
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            // TODO: placeholder color
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          {label}
        </span>
        <InterlayTooltip label={tooltip}>
          <InformationCircleIcon
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
              'w-5',
              'h-5'
            )} />
        </InterlayTooltip>
      </div>
      <span
        className={clsx(
          // TODO: placeholder color
          { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          // TODO: placeholder color
          { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        {value}
      </span>
    </div>
  );
};

export default InformationUI;
