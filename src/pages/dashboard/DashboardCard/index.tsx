
import clsx from 'clsx';

const DashboardCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'dashboard-card',
      'h-96',
      'px-5',
      'py-4',
      'xl:py-7',
      'shadow-md',
      // MEMO: bootstrap card style
      'relative',
      'flex',
      'flex-col',
      'min-w-0',
      'break-words',
      'bg-white',
      'bg-clip-border',
      'rounded-lg',
      'border',
      'border-solid',
      'border-gray-200',
      className
    )}
    {...rest} />
);

export default DashboardCard;
