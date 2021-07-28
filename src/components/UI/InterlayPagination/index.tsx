
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import clsx from 'clsx';

const focusStyling = clsx(
  'focus:outline-none',
  'focus:ring',
  'focus:border-primary-300',
  'focus:ring-primary-200',
  'focus:ring-opacity-50'
);

const InterlayPagination = ({
  onPageChange,
  ...rest
}: Props): JSX.Element => {
  return (
    <ReactPaginate
      previousLabel='Previous'
      nextLabel='Next'
      breakLabel='...'
      onPageChange={onPageChange}
      breakLinkClassName={clsx(
        focusStyling,
        'px-4',
        'py-2'
      )}
      breakClassName={clsx(
        'relative',
        'inline-flex',
        'items-center',
        'border',
        'border-gray-300',
        'bg-white',
        'text-gray-700',
        'text-sm',
        'font-medium'
      )}
      containerClassName={clsx(
        'relative',
        'z-0',
        'inline-flex',
        'rounded-md',
        'shadow-sm',
        '-space-x-px',
        'select-none'
      )}
      previousLinkClassName={clsx(
        focusStyling,
        'px-4',
        'py-2'
      )}
      previousClassName={clsx(
        'relative',
        'inline-flex',
        'items-center',
        'rounded-l-md',
        'border',
        'border-gray-300',
        'bg-white',
        'hover:bg-gray-50',
        'text-gray-500',
        'text-sm',
        'font-medium'
      )}
      pageLinkClassName={clsx(
        focusStyling,
        'px-4',
        'py-2'
      )}
      pageClassName={clsx(
        'relative',
        'md:inline-flex',
        'items-center',
        'hidden',
        'border',
        'border-gray-300',
        'bg-white',
        'hover:bg-gray-50',
        'text-gray-500',
        'text-sm',
        'font-medium'
      )}
      nextLinkClassName={clsx(
        focusStyling,
        'px-4',
        'py-2'
      )}
      nextClassName={clsx(
        'relative',
        'inline-flex',
        'items-center',
        'rounded-r-md',
        'border',
        'border-gray-300',
        'bg-white',
        'hover:bg-gray-50',
        'text-gray-500',
        'text-sm',
        'font-medium'
      )}
      activeLinkClassName={clsx(
        focusStyling,
        'px-4',
        'py-2'
      )}
      activeClassName={clsx(
        'z-interlaySpeedDial',
        'relative',
        'inline-flex',
        'items-center',
        'border',
        'border-interlayDenim',
        'bg-interlayDenim-50',
        'text-interlayDenim-600',
        'text-sm',
        'font-medium'
      )}
      {...rest} />
  );
};

export type Props = ReactPaginateProps;

export default InterlayPagination;
