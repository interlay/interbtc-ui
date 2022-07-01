import { useState } from 'react';

import useInterval from 'utils/hooks/use-interval';

const formatTime = (seconds: number): string => {
  return `Last updated ${seconds} seconds ago`;
};

function TimerIncrement(): JSX.Element {
  const [seconds, setSeconds] = useState(0);

  useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return <>{formatTime(seconds)}</>;
}

export default TimerIncrement;
