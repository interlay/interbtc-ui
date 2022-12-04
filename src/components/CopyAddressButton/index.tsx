import clsx from 'clsx';

import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/components/UI/InterlayButtonBase';
import useCopyToClipboard from '@/utils/hooks/use-copy-to-clipboard';

interface CustomProps {
  address: string;
}

// ray test touch <
const CopyAddressButton = ({ address, className }: CustomProps & InterlayButtonBaseProps): JSX.Element => {
  const { handleCopyToClipboard, CopyToClipboardUI } = useCopyToClipboard(address);

  return (
    <InterlayButtonBase className={className} onClick={handleCopyToClipboard}>
      <CopyToClipboardUI className={clsx('w-6', 'h-6')} />
    </InterlayButtonBase>
  );
};
// ray test touch >

export default CopyAddressButton;
