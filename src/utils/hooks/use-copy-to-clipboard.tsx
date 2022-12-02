// ray test touch <
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import * as React from 'react';
import { useCopyToClipboard as useLibCopyToClipboard, useTimeoutFn } from 'react-use';

interface CopyToClipboardUIProps {
  className?: string;
}

const useCopyToClipboard = (
  text: string
): {
  handleCopyToClipboard: () => void;
  CopyToClipboardUI: React.ElementType;
} => {
  const [state, copyToClipboard] = useLibCopyToClipboard();
  const [showCopied, setShowCopied] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [_, __, reset] = useTimeoutFn(() => {
    setShowCopied(false);
  }, 1000);

  const handleCopyToClipboard = () => {
    copyToClipboard(text);
    setShowCopied(true);
    reset();
  };

  const CopyToClipboardUI = ({ className }: CopyToClipboardUIProps): JSX.Element => {
    return (
      <>
        {state.value === text && showCopied ? (
          <CheckIcon className={className} />
        ) : (
          <DocumentDuplicateIcon className={className} />
        )}
      </>
    );
  };

  return {
    handleCopyToClipboard,
    CopyToClipboardUI
  };
};

export default useCopyToClipboard;
// ray test touch >
