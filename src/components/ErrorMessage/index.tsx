
interface Props {
  message?: string;
}

const ErrorMessage = ({ message }: Props): JSX.Element => (
  <>
    {message && <p>{message}</p>}
  </>
);

export default ErrorMessage;
