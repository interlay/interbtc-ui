
import { useState } from 'react';

import useInterval from 'utils/hooks/use-interval';

const formatTime = (seconds: number): string => {
  if (seconds > 60) {
    return `Last updated a minute ago`;
  }
  return `Last updated ${seconds} seconds ago`;
};

function TimerIncrement() {
  const [seconds, setSeconds] = useState(0);

  useInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return <>{formatTime(seconds)}</>;
}

export default TimerIncrement;
