import * as React from 'react';

type TransitionTrigger = 'in' | 'out';

interface UseMountTransitionResult {
  shouldRender: boolean;
  transitionTrigger: TransitionTrigger;
}
// MEMO: Inspired by: https://stackoverflow.com/a/54114180

const useMountTransition = (isMounted: boolean, transitionDuration: number): UseMountTransitionResult => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const [transitionTrigger, setTransitionTrigger] = React.useState<'in' | 'out'>('in');

  React.useEffect(() => {
    let unmountDelayTimeout: NodeJS.Timeout;
    let mountTransitionTimeout: NodeJS.Timeout;
    if (isMounted) {
      setShouldRender(true);
      mountTransitionTimeout = setTimeout(() => setTransitionTrigger('in'), 0);
    } else if (!isMounted) {
      setTransitionTrigger('out');
      unmountDelayTimeout = setTimeout(() => setShouldRender(false), transitionDuration);
    }
    return () => {
      clearTimeout(unmountDelayTimeout);
      clearTimeout(mountTransitionTimeout);
    };
  }, [isMounted, transitionDuration]);

  return { shouldRender, transitionTrigger };
};
export { useMountTransition };
export type { TransitionTrigger };
