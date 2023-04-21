import { FC, HTMLAttributes, JSXElementConstructor } from 'react';

type Step = string | number;

type StepComponentProps = {
  step: Step;
};

type Props = HTMLAttributes<unknown> & { step: Step };

const withStep = <T extends Props>(Component: JSXElementConstructor<T>, componentStep: number): FC<T> => {
  const Step: FC<T> = (props: T): JSX.Element | null =>
    props.step === componentStep ? <Component {...props} /> : null;

  Step.displayName = 'CreateVaultStep';

  return Step;
};

export { withStep };
export type { Step, StepComponentProps };
