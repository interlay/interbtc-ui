import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/components/UI/InterlayButtonBase';
import useCopyToClipboard from '@/utils/hooks/use-copy-to-clipboard';

interface CustomProps {
  address: string;
}

const COPY_ADDRESS_ICON_CLASSES = clsx('w-6', 'h-6');

// ray test touch <
const CopyAddressButton = ({ address, className }: CustomProps & InterlayButtonBaseProps): JSX.Element => {
  const { handleCopyToClipboard, CopyToClipboardUI } = useCopyToClipboard(address);

  return (
    <InterlayButtonBase className={className} onClick={handleCopyToClipboard}>
      <CopyToClipboardUI className={COPY_ADDRESS_ICON_CLASSES} />
    </InterlayButtonBase>
  );
};
// ray test touch >

export default CopyAddressButton;
