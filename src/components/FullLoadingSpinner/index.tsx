
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import { ReactComponent as SpinIcon } from 'assets/img/icons/spin.svg';
interface CustomProps {
  text?: string;
}

const FullLoadingSpinner = ({
  text,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'justify-center',
      'items-center',
      'absolute',
      'top-0',
      'left-0',
      'w-full',
      'h-full',
      'bg-white',
      className
    )}
    {...rest}>
    <div
      className={clsx(
        'inline-flex',
        'flex-col',
        'items-center',
        'space-y-2'
      )}>
      <SpinIcon
        className={clsx(
          { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          { 'text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
          'animate-spin',
          'w-9',
          'h-9'
        )} />
      {text && (
        <p
          className={clsx(
            'font-medium',
            'text-sm'
          )}>
          {text}
        </p>
      )}
    </div>
  </div>
);

export default FullLoadingSpinner;
