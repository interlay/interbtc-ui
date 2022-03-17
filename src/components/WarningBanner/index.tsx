
// ray test touch <<
import clsx from 'clsx';

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
        'bg-kintsugiThunderbird',
        'text-sm',
        'font-medium',
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
// ray test touch >>
