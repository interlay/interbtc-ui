import * as React from 'react';
import clsx from 'clsx';
import {
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/outline';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import {
  KUSAMA,
  POLKADOT
} from 'utils/constants/relay-chain-names';
import { copyToClipboard } from 'common/utils/utils';

interface CustomProps {
  address: string;
}

const CopyAddressButton = ({
  address,
  className
}: CustomProps & InterlayButtonBaseProps): JSX.Element => {
  const [addressCopied, setAddressCopied] = React.useState<boolean>(false);

  const handleCopyAddress = ((address: string) => {
    copyToClipboard(address);
    setAddressCopied(true);
  });

  React.useEffect(() => {
    if (!addressCopied) return;

    const resetAddressCopied = setTimeout(() => {
      setAddressCopied(false);
    }, 1000);

    return () => clearTimeout(resetAddressCopied);
  }, [addressCopied]);

  return (
    <InterlayButtonBase
      className={clsx(
        'ml-2',
        { 'hover:bg-interlayHaiti-50':
        process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT },
        { 'dark:hover:bg-white': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        { 'dark:hover:bg-opacity-10': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA },
        className
      )}
      onClick={() => handleCopyAddress(address)}>
      {addressCopied ? (
        <CheckIcon
          className={clsx(
            'h-6',
            'w-6'
          )} />) : (
        <DocumentDuplicateIcon
          className={clsx(
            'h-6',
            'w-6'
          )} />)}
    </InterlayButtonBase>);
};

export default CopyAddressButton;
