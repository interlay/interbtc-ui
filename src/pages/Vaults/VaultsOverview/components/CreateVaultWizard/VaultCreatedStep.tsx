import { StepComponentProps } from './types';

type VaultCreatedStepProps = StepComponentProps;

const componentStep = 3 as const;

const VaultCreatedStep = ({ step }: VaultCreatedStepProps): JSX.Element | null => {
  if (step !== componentStep) {
    return null;
  }

  return <>VaultCreatedStep</>;
};

export { VaultCreatedStep };
