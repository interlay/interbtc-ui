import { useState } from 'react';

import { DespositCollateralStep } from './DespositCollateralStep';
import { DisclaimerStep } from './DisclaimerStep';
import { Steps } from './types';
import { VaultCreatedStep } from './VaultCreatedStep';

const CreateVaultWizard = (): JSX.Element => {
  const [step, setStep] = useState<Steps>(1);

  const handleNextStep = () => setStep((s) => (s + 1) as Steps);

  return (
    <>
      <DisclaimerStep step={step} onClickAgree={handleNextStep} />
      <DespositCollateralStep step={step} onDeposit={handleNextStep} />
      <VaultCreatedStep step={step} />
    </>
  );
};

export { CreateVaultWizard };
