import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';

interface Props {
  error: Error | string;
  resetErrorBoundary?: () => void;
}

const handleRefresh = () => {
  window.location.reload();
};

const ErrorFallback = ({ error, resetErrorBoundary }: Props): JSX.Element => {
  let message;

  // TODO: should remove later as it's a workaround
  if (typeof error === 'string') {
    message = error;
  } else {
    message = error.message;
  }

  return (
    <p className={clsx('text-interlayCinnabar', 'space-x-1')}>
      <span>Error: {message}.</span>
      <span>
        Please&nbsp;
        <InterlayLink onClick={resetErrorBoundary ?? handleRefresh} className={clsx('underline', 'cursor-pointer')}>
          refresh
        </InterlayLink>
        .
      </span>
    </p>
  );
};

export default ErrorFallback;
