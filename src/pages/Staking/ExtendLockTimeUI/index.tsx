
import clsx from 'clsx';

import NumberInput from 'components/NumberInput';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const EXTENDING_LOCK_TIME = 'extending-lock-time';

const ExtendLockTimeUI = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
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
          'space-x-1',
          // TODO: placeholder color
          { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
          // TODO: placeholder color
          { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
        )}>
        <span>Extend lock time in weeks</span>
        <span className='text-xs'>(Optional):</span>
      </div>
      <div
        className={clsx(
          'inline-flex',
          'items-center',
          'space-x-2.5'
        )}>
        <NumberInput
          id={EXTENDING_LOCK_TIME}
          name={EXTENDING_LOCK_TIME}
          className='!w-12'
          placeholder='0'
          step={1}
          min={0} />
        <span
          className={clsx(
            'text-xs',
            // TODO: placeholder color
            { 'text-interlayTextSecondaryInLightMode': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
            // TODO: placeholder color
            { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
          )}>
          Weeks
        </span>
      </div>
    </div>
  );
};

export default ExtendLockTimeUI;
