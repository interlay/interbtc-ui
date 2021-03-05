import { ReactElement, useEffect, useState } from 'react';

type TimerProps = {
  seconds: number;
};

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

export default function Timer(props: TimerProps): ReactElement {
  const [leftSeconds, setSeconds] = useState(0);
  let counter = props.seconds;

  useEffect(() => {
    setSeconds(props.seconds);
    const interval = setInterval(() => setSeconds(--counter), 1000);
    return () => clearInterval(interval);
  }, [counter, props.seconds]);

  return <div>{formatTime(leftSeconds)}</div>;
}
