import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'react-use';

import { theme } from '@/component-library';
import { useWindowFocus } from '@/hooks/use-window-focus';

type UseCountdownProps = {
  value?: number;
  timeout?: number;
  disabled?: boolean;
  onEndCountdown?: () => void;
};

type UseCountdownResult = {
  value: number;
  start: () => void;
  stop: () => void;
};

const useCountdown = ({
  value = 100,
  timeout = 8000,
  disabled,
  onEndCountdown
}: UseCountdownProps): UseCountdownResult => {
  const windowFocused = useWindowFocus();

  const [countdown, setProgress] = useState(value);
  const [isRunning, setRunning] = useState(disabled);

  // handles the countdown
  useInterval(
    () => setProgress((prev) => prev - 1),
    isRunning ? timeout / theme.transition.duration.duration100 : null
  );

  const handleStartCountdown = useCallback(() => {
    const shouldRun = !disabled && countdown > 0;
    setRunning(shouldRun);
  }, [countdown, disabled]);

  const handleStopCountdown = () => setRunning(false);

  useEffect(() => {
    if (isRunning && countdown === 0) {
      onEndCountdown?.();
      handleStopCountdown();
    }
  }, [isRunning, countdown, onEndCountdown]);

  useEffect(() => {
    if (windowFocused && !disabled) {
      handleStartCountdown();
    } else {
      handleStopCountdown();
    }
  }, [windowFocused, handleStartCountdown, disabled]);

  return {
    value: countdown,
    start: handleStartCountdown,
    stop: handleStopCountdown
  };
};

export { useCountdown };
export type { UseCountdownProps, UseCountdownResult };
