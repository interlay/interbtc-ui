import * as React from 'react';
import clsx from 'clsx';
import {
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/outline';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from 'components/UI/InterlayButtonBase';
import { copyToClipboard } from 'common/utils/utils';

interface CustomProps {
  address: string;
}

const COPY_ADDRESS_ICON_CLASSES = clsx(
  'w-6',
  'h-6'
);

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
        className
      )}
      onClick={() => handleCopyAddress(address)}>
      {addressCopied ? (
        <CheckIcon
          className={COPY_ADDRESS_ICON_CLASSES} />) : (
        <DocumentDuplicateIcon
          className={COPY_ADDRESS_ICON_CLASSES} />)
      }
    </InterlayButtonBase>);
};

export default CopyAddressButton;
