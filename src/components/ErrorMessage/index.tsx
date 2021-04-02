
interface Props {
  message?: string;
}

const ErrorMessage = ({ message }: Props) => (
  <>
    {message && <p>{message}</p>}
  </>
);

export default ErrorMessage;
