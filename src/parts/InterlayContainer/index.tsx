
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
}

const InterlayContainer = ({ children }: Props): JSX.Element => (
  <div
    className={clsx(
      'w-full',
      'px-4',
      'mx-auto',
      'sm:max-w-xl',
      'md:max-w-2xl',
      'lg:max-w-4xl',
      'xl:max-w-6xl',
      '2xl:max-w-7xl'
    )}>
    {children}
  </div>
);

export default InterlayContainer;
