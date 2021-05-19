
import clsx from 'clsx';

import InterlayLink from 'components/UI/InterlayLink';

interface Props {
  error: Error | string;
}

const handleRefresh = () => {
  window.location.reload();
};

const ErrorHandler = ({ error }: Props): JSX.Element => {
  let message;

  // TODO: should remove later as it's a workaround
  if (typeof error === 'string') {
    message = error;
  } else {
    message = error.message;
  }

  return (
    <p
      className={clsx(
        'text-interlayScarlet',
        'space-x-1'
      )}>
      <span>Error: {message}.</span>
      <span>
        Please&nbsp;
        <InterlayLink
          href='#'
          onClick={handleRefresh}
          style={{ textDecoration: 'underline' }}>
          refresh
        </InterlayLink>.
      </span>
    </p>
  );
};

export default ErrorHandler;
