
import clsx from 'clsx';

import { KUSAMA } from 'utils/constants/relay-chain-names';
import { LIGHT_DARK_BORDER_CLASSES } from 'utils/constants/styles';
import { ReactComponent as InformationCircleIcon } from 'assets/img/hero-icons/information-circle.svg';

interface CustomProps {
  message: string;
}

const WarningBanner = ({
  message,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <div
      className={clsx(
        'flex',
        'items-center',
        'px-8',
        'py-3',
        'space-x-3',
        'sm:rounded-lg',
        // TODO: Interlay version is missing
        // TODO: placeholder color
        { 'dark:bg-kintsugiThunderbird': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-sm',
        'font-medium',
        LIGHT_DARK_BORDER_CLASSES,
        className
      )}
      style={{
        minHeight: 64
      }}
      {...rest}>
      <InformationCircleIcon
        className={clsx(
          'w-6',
          'h-6'
        )} />
      <p>{message}</p>
    </div>
  );
};

export default WarningBanner;
