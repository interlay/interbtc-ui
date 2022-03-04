
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
      'font-medium',
      'break-words',
      'text-base',
      { 'text-interlayDenim':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
      { 'dark:text-kintsugiOchre': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
      'text-center',
      'uppercase',
      className
    )}
    {...rest} />
);

export default RequestModalTitle;
