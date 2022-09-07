import { CTA } from '@/component-library';

import { StepComponentProps } from './types';

type Props = {
  onDeposit: () => void;
};

type DespositCollateralStepProps = Props & StepComponentProps;

const componentStep = 2 as const;

const DespositCollateralStep = ({ step, onDeposit }: DespositCollateralStepProps): JSX.Element | null => {
  if (step !== componentStep) {
    return null;
  }

  return (
    <div>
      DespositCollateralStep
      <CTA onClick={onDeposit}>Deposit 10000.00 KSM</CTA>
    </div>
  );
};

export { DespositCollateralStep };
