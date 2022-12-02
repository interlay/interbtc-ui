import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import * as React from 'react';
// ray test touch <
import { useCopyToClipboard, useTimeoutFn } from 'react-use';

// import { copyToClipboard } from '@/common/utils/utils';
// ray test touch >
import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/components/UI/InterlayButtonBase';

interface CustomProps {
  address: string;
}

const COPY_ADDRESS_ICON_CLASSES = clsx('w-6', 'h-6');

const CopyAddressButton = ({ address, className }: CustomProps & InterlayButtonBaseProps): JSX.Element => {
  // ray test touch <
  const [state, copyToClipboard] = useCopyToClipboard();
  const [showCopied, setShowCopied] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_, __, reset] = useTimeoutFn(() => {
    setShowCopied(false);
  }, 1000);
  // ray test touch >

  // ray test touch <
  // const [addressCopied, setAddressCopied] = React.useState<boolean>(false);
  const handleCopyToClipboard = (text: string) => {
    copyToClipboard(text);
    setShowCopied(true);
    reset();
  };
  // const handleCopyAddress = (address: string) => {
  //   copyToClipboard(address);
  //   setAddressCopied(true);
  // };
  // React.useEffect(() => {
  //   if (!addressCopied) return;
  //   const resetAddressCopied = setTimeout(() => {
  //     setAddressCopied(false);
  //   }, 1000);
  //   return () => clearTimeout(resetAddressCopied);
  // }, [addressCopied]);
  // ray test touch >

  // ray test touch <
  return (
    <InterlayButtonBase className={className} onClick={() => handleCopyToClipboard(address)}>
      {state.value === address && showCopied ? (
        <CheckIcon className={COPY_ADDRESS_ICON_CLASSES} />
      ) : (
        <DocumentDuplicateIcon className={COPY_ADDRESS_ICON_CLASSES} />
      )}
    </InterlayButtonBase>
  );
  // ray test touch >
};

export default CopyAddressButton;
