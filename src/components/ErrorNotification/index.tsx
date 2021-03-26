
interface Props {
  message?: string;
}

const ErrorNotification = ({ message }: Props) => (
  <>
    {message && <p>{message}</p>}
  </>
);

export default ErrorNotification;
