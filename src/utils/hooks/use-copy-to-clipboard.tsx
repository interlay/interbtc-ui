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

  const handleCopyToClipboard = React.useCallback(() => {
    copyToClipboard(text);
    setShowCopied(true);
    reset();
  }, [copyToClipboard, reset, text]);

  const CopyToClipboardUI = React.useMemo(() => {
    // eslint-disable-next-line react/display-name
    return ({ className }: CopyToClipboardUIProps): JSX.Element => {
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
  }, [showCopied, state.value, text]);

  return {
    handleCopyToClipboard,
    CopyToClipboardUI
  };
};

export default useCopyToClipboard;
