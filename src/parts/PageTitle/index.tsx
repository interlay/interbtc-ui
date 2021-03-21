
import clsx from 'clsx';

interface Props {
  mainTitle: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
}

const PageTitle = ({
  className,
  mainTitle,
  subTitle,
  ...rest
}: Props & React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'text-center',
      'mt-7',
      'mb-4',
      'font-bold',
      className
    )}
    {...rest}>
    <h2
      className={clsx(
        'text-2xl',
        'xl:text-3xl',
        'mb-1'
      )}>
      {mainTitle}
    </h2>
    {subTitle && (
      <p
        className={clsx(
          'text-xs',
          'xl:text-sm'
        )}>
        {subTitle}
      </p>
    )}
  </div>
);

export default PageTitle;
