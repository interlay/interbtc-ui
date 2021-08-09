
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
}: Props & React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'text-center',
      // ray test touch <<
      // 'mt-7',
      'mb-4',
      // ray test touch >>
      className
    )}
    {...rest}>
    <h2
      className={clsx(
        'text-2xl',
        'xl:text-3xl',
        'mb-1',
        'font-bold'
      )}>
      {mainTitle}
    </h2>
    {subTitle && (
      <p
        className={clsx(
          'text-xs',
          'xl:text-sm',
          // ray test touch <<
          'mb-4'
          // ray test touch >>
        )}>
        {subTitle}
      </p>
    )}
  </div>
);

export default PageTitle;
