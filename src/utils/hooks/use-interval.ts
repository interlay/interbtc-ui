
import {
  useEffect,
  useRef
} from 'react';

function useInterval(
  callback: () => void,
  delay: number | null,
  shouldRunInitially: boolean = false
) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay !== null) {
      if (shouldRunInitially) {
        savedCallback.current?.();
      }

      let timerId = setTimeout(function tick() {
        savedCallback.current?.();

        timerId = setTimeout(tick, delay);
      }, delay);

      return () => clearInterval(timerId);
    }
  }, [
    delay,
    shouldRunInitially
  ]);
}

export default useInterval;
