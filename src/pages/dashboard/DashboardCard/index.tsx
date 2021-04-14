
import clsx from 'clsx';

const DashboardCard = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    // TODO: hardcoded
    style={{
      minHeight: 384
    }}
    className={clsx(
      'dashboard-card', // TODO: should remove this global CSS class
      'px-5',
      'py-4',
      'xl:py-7',
      'shadow',
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
