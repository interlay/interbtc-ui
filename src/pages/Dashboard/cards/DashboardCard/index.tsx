import clsx from 'clsx';

import Panel from 'components/Panel';

const DashboardCard = ({ className, ...rest }: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <Panel
    style={{
      minHeight: 384
    }}
    className={clsx('flex', 'flex-col', 'justify-between', 'px-4', 'py-5', 'xl:py-6', 'space-y-5', className)}
    {...rest}
  />
);

export default DashboardCard;
