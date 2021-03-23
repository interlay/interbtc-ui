
// ray test touch <
import {
  useEffect,
  useRef
} from 'react';

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const timerId = setInterval(tick, delay);

      return () => clearInterval(timerId);
    }
  }, [delay]);
}

export default useInterval;
// ray test touch >
