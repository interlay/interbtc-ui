import clsx from 'clsx';

import { ReactComponent as InformationCircleIcon } from '@/assets/img/hero-icons/information-circle.svg';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { BORDER_CLASSES } from '@/utils/constants/styles';

type WarningLevel = 'alert' | 'info';

interface CustomProps {
  warningLevel: WarningLevel;
}

type Props = CustomProps & React.ComponentPropsWithRef<'div'>;

const WarningBanner = ({ warningLevel, children, className, ...rest }: Props): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex',
        'items-center',
        'px-8',
        'py-3',
        'space-x-3',
        'sm:rounded-lg',
        { 'text-white': warningLevel === 'alert' },
        { 'bg-interlayCinnabar': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT && warningLevel === 'alert' },
        { 'bg-interlayCalifornia': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT && warningLevel === 'info' },
        {
          'dark:bg-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA && warningLevel === 'alert'
        },
        { 'dark:bg-interlayCalifornia': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA && warningLevel === 'info' },
        'text-sm',
        'font-medium',
        BORDER_CLASSES,
        className
      )}
      style={{
        minHeight: 64
      }}
      {...rest}
    >
      <InformationCircleIcon className={clsx('w-6', 'h-6')} />
      {children}
    </div>
  );
};

export type { Props };

export default WarningBanner;
