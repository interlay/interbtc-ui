import { FC, HTMLAttributes, JSXElementConstructor } from 'react';

type Steps = 1 | 2 | 3;

type StepComponentProps = {
  step: Steps;
};

type Props = HTMLAttributes<unknown> & { step: Steps };

const withStep = <T extends Props>(Component: JSXElementConstructor<T>, componentStep: number): FC<T> => {
  const Step: FC<T> = (props: T): JSX.Element | null =>
    props.step === componentStep ? <Component {...props} /> : null;

  Step.displayName = 'CreateVaultStep';

  return Step;
};

export { withStep };
export type { StepComponentProps, Steps };
