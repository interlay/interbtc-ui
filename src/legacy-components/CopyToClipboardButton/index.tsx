import clsx from 'clsx';

import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';
import InterlayButtonBase, { Props as InterlayButtonBaseProps } from '@/legacy-components/UI/InterlayButtonBase';

interface Props extends InterlayButtonBaseProps {
  text: string;
  innerClassName?: string;
}

const CopyToClipboardButton = ({ text, className, innerClassName, ...rest }: Props): JSX.Element => {
  const { handleCopyToClipboard, CopyToClipboardUI } = useCopyToClipboard(text);

  return (
    <InterlayButtonBase className={className} onClick={handleCopyToClipboard} {...rest}>
      <CopyToClipboardUI className={clsx('w-6', 'h-6', innerClassName)} />
    </InterlayButtonBase>
  );
};

export default CopyToClipboardButton;
