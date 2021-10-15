
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import clsx from 'clsx';

import { KUSAMA } from 'utils/constants/relay-chain-names';

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
        // ray test touch <<
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-gray-700',
        // ray test touch >>
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
        // ray test touch <<
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-gray-500',
        // ray test touch >>
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
        // ray test touch <<
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-gray-500',
        // ray test touch >>
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
        // ray test touch <<
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-gray-500',
        // ray test touch >>
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
        // ray test touch <<
        'border-interlayDenim',
        'bg-interlayDenim-50',
        'text-interlayDenim-600',
        // ray test touch >>
        'text-sm',
        'font-medium'
      )}
      {...rest} />
  );
};

export type Props = ReactPaginateProps;

export default InterlayPagination;
