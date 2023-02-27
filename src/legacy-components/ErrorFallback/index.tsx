import clsx from 'clsx';

import InterlayLink from '@/legacy-components/UI/InterlayLink';
import { getColorShade } from '@/utils/helpers/colors';

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

  console.log(message);

  return (
    <p className={clsx(getColorShade('red'), 'space-x-1')}>
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
