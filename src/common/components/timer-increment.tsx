import { ReactElement, useEffect, useState } from 'react';

const formatTime = (seconds: number): string => {
  return 'Last updated ' + seconds + ' seconds ago';
};

export default function TimerIncrement(): ReactElement {
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
  }, []);

  return <>{formatTime(timer)}</>;
}
