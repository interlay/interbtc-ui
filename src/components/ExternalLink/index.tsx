
import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';

import InterlayLink, { Props as InterlayLinkProps } from 'components/UI/InterlayLink';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';

const ExternalLink = ({
  className,
  children,
  ...rest
}: InterlayLinkProps): JSX.Element => {
  return (
    <InterlayLink
      className={clsx(
        { 'text-interlayDenim':
          process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
        { 'dark:text-kintsugiMidnight':
          process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'space-x-1.5',
        'inline-flex',
        'items-center',
        className
      )}
      target='_blank'
      rel='noopener noreferrer'
      {...rest}>
      <div
        className={clsx(
          'inline-flex',
          'items-center',
          'space-x-1.5'
        )}>
        {children}
      </div>
      <FaExternalLinkAlt />
    </InterlayLink>
  );
};

export default ExternalLink;
