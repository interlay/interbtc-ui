
import clsx from 'clsx';

interface Props {
  title: JSX.Element;
  unitIcon: JSX.Element;
  value: string; // TODO: should be number
  unitName: string;
  approxUSD: string; // TODO: should be number
  tooltip?: JSX.Element;
  className?: string;
}

const PriceInfo = ({
  title,
  unitIcon,
  value,
  unitName,
  approxUSD,
  tooltip,
  className
}: Props): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'justify-between',
      className
    )}>
    <div
      className={clsx(
        'flex',
        'items-center',
        'space-x-1'
      )}>
      {title}
      {tooltip}
    </div>
    <div
      className={clsx(
        'flex',
        'flex-col',
        'items-end'
      )}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        {unitIcon}
        <span className='font-medium'>
          {value}
        </span>
        <span className='text-textSecondary'>
          {unitName}
        </span>
      </div>
      <span
        className={clsx(
          'block',
          'text-textSecondary'
        )}>
        {`≈ $ ${approxUSD}`}
      </span>
    </div>
  </div>
);

export default PriceInfo;
