import clsx from 'clsx';
import { FaExternalLinkAlt } from 'react-icons/fa';

import InterlayLink, { Props as InterlayLinkProps } from '@/components/UI/InterlayLink';
import { KUSAMA,POLKADOT } from '@/utils/constants/relay-chain-names';

const ExternalLink = ({ className, children, ...rest }: InterlayLinkProps): JSX.Element => {
  return (
    <InterlayLink
      className={clsx(
        { 'text-interlayDenim': process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:text-kintsugiSupernova': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        'space-x-1.5',
        'inline-flex',
        'items-center',
        className
      )}
      target='_blank'
      rel='noopener noreferrer'
      {...rest}
    >
      <span className='inline-flex'>{children}</span>
      <FaExternalLinkAlt />
    </InterlayLink>
  );
};

export default ExternalLink;
