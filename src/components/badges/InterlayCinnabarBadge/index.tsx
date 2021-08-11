
import clsx from 'clsx';

const InterlayCinnabarBadge = ({
  className,
  ...rest
}: Props): JSX.Element => (
  <span
    className={clsx(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium',
      'bg-interlayCinnabar-100',
      'text-interlayCinnabar-800',
      className
    )}
    {...rest} />
);

export type Props = React.ComponentPropsWithRef<'span'>;

export default InterlayCinnabarBadge;
