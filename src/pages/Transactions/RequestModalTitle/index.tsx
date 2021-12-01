
import clsx from 'clsx';

import {
  InterlayModalTitle,
  InterlayModalTitleProps
} from 'components/UI/InterlayModal';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const RequestModalTitle = ({
  className,
  ...rest
}: InterlayModalTitleProps): JSX.Element => (
  <InterlayModalTitle
    as='h3'
    className={clsx(
      'text-lg',
      'font-medium',
      'break-words',
      'text-base',
      { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
      { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'text-center',
      'uppercase',
      className
    )}
    {...rest} />
);

export default RequestModalTitle;
