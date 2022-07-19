import clsx from 'clsx';
import * as React from 'react';

// TODO: should use a package like `date-fns` instead of manually calculating
const formatTime = (leftSeconds: number): string => {
  const days = Math.floor(leftSeconds / (3600 * 24));
  const hours = Math.floor((leftSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((leftSeconds % 3600) / 60);
  const seconds = Math.floor(leftSeconds % 60);
  const d = days;
  const h = hours < 10 ? '0' + hours : hours;
  const m = minutes < 10 ? '0' + minutes : minutes;
  const s = seconds < 10 ? '0' + seconds : seconds;
  return leftSeconds > 0 ? d + ' Days ' + h + ':' + m + ':' + s : '00:00:00';
};

interface CustomProps {
  initialLeftSeconds: number;
}

const Timer = ({
  initialLeftSeconds,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'span'>): JSX.Element => {
  const [leftSeconds, setLeftSeconds] = React.useState(initialLeftSeconds);

  React.useEffect(() => {
    // TODO: should avoid unnecessary rendering (if `initialLeftSeconds` is not greater than zero)
    // TODO: should use `useInterval`
    const timerId = setInterval(() => {
      setLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <span className={clsx('whitespace-nowrap', className)} {...rest}>
      {formatTime(leftSeconds)}
    </span>
  );
};

export default Timer;
