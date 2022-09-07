import { CTA } from '@/component-library';

import { StepComponentProps } from './types';

type Props = {
  onClickAgree?: () => void;
};

type DisclaimerStepProps = Props & StepComponentProps;

const componentStep = 1 as const;

const DisclaimerStep = ({ step, onClickAgree }: DisclaimerStepProps): JSX.Element | null => {
  if (step !== componentStep) {
    return null;
  }

  return (
    <div>
      DisclaimerStep
      <CTA onClick={onClickAgree}>I understand the risks involved, create a vault</CTA>
      <CTA variant='secondary' onClick={onClickAgree}>
        Read the Vault Documentation
      </CTA>
    </div>
  );
};

export { DisclaimerStep };
