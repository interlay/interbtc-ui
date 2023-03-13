import { Children, cloneElement, ReactNode } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

const OPEN_STATES: Partial<Record<TransitionStatus, boolean>> = {
  entered: true,
  entering: false
};

type Props = { children: ReactNode };

type InheritAttrs = Omit<Partial<TransitionProps>, keyof Props>;

type OpenTransitionProps = Props & InheritAttrs;

/**
 * `enter` is set to 0 ms to let our css animation play
 * `exit` is set to 350 ms to let
 */

const OpenTransition = (props: OpenTransitionProps): any => {
  // Do not apply any transition if in chromatic (based on react-spectrum)
  if (process.env.CHROMATIC) {
    return Children.map(props.children, (child) => child && cloneElement(child as any, { isOpen: props.in }));
  }

  return (
    <Transition timeout={{ enter: 0, exit: 350 }} {...props}>
      {(state) =>
        Children.map(props.children, (child) => child && cloneElement(child as any, { isOpen: !!OPEN_STATES[state] }))
      }
    </Transition>
  );
};

export { OpenTransition };
export type { OpenTransitionProps };
