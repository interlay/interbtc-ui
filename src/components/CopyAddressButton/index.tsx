import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import * as React from 'react';

import { copyToClipboard } from '@/common/utils/utils';
import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/components/UI/InterlayButtonBase';

interface CustomProps {
  address: string;
}

const COPY_ADDRESS_ICON_CLASSES = clsx('w-6', 'h-6');

const CopyAddressButton = ({ address, className }: CustomProps & InterlayButtonBaseProps): JSX.Element => {
  const [addressCopied, setAddressCopied] = React.useState<boolean>(false);

  const handleCopyAddress = (address: string) => {
    copyToClipboard(address);
    setAddressCopied(true);
  };

  React.useEffect(() => {
    if (!addressCopied) return;

    const resetAddressCopied = setTimeout(() => {
      setAddressCopied(false);
    }, 1000);

    return () => clearTimeout(resetAddressCopied);
  }, [addressCopied]);

  return (
    <InterlayButtonBase className={className} onClick={() => handleCopyAddress(address)}>
      {addressCopied ? (
        <CheckIcon className={COPY_ADDRESS_ICON_CLASSES} />
      ) : (
        <DocumentDuplicateIcon className={COPY_ADDRESS_ICON_CLASSES} />
      )}
    </InterlayButtonBase>
  );
};

export default CopyAddressButton;
