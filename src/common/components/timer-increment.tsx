
import {
  useState,
  useEffect
} from 'react';

const formatTime = (seconds: number): string => {
  return `Last updated ${seconds} seconds ago`;
};

function TimerIncrement() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <>{formatTime(seconds)}</>;
}

export default TimerIncrement;
