
interface Props {
  error: Error | string;
}

const ErrorHandler = ({ error }: Props): JSX.Element => {
  let message;

  // TODO: should remove later as it's a workaround
  if (typeof error === 'string') {
    message = error;
  } else {
    message = error.message;
  }

  return (
    <p className='text-interlayScarlet'>
      Error: {message}
    </p>
  );
};

export default ErrorHandler;
