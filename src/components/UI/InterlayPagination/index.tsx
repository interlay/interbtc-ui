
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import clsx from 'clsx';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const focusStyling = clsx(
  'focus:outline-none',
  'focus:ring',
  { 'focus:border-interlayDenim-300':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
  { 'focus:ring-interlayDenim-200':
    process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
  { 'dark:focus:border-kintsugiMidnight-300': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
  { 'dark:focus:ring-kintsugiMidnight-200': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
        { 'dark:border-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'bg-white',
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
        { 'dark:border-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'bg-white',
        'hover:bg-gray-50',
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
        { 'dark:border-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'bg-white',
        'hover:bg-gray-50',
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
        { 'dark:border-kintsugiAlto': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'bg-white',
        'hover:bg-gray-50',
        { 'dark:bg-kintsugiMidnight-400': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayTextPrimaryInLightMode':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
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
        { 'border-interlayDenim':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:border-kintsugiMidnight': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'bg-interlayDenim-50':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:bg-kintsugiMidnight-50': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'text-interlayDenim-600':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiMidnight-600': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'dark:text-kintsugiTextPrimaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'text-sm',
        'font-medium'
      )}
      {...rest} />
  );
};

export type Props = ReactPaginateProps;

export default InterlayPagination;
