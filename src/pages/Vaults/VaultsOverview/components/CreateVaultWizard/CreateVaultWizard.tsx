import { useState } from 'react';

import { VaultsTableRow } from '../VaultsTable';
import { DespositCollateralStep } from './DespositCollateralStep';
import { DisclaimerStep } from './DisclaimerStep';
import { Steps } from './types';
import { VaultCreatedStep } from './VaultCreatedStep';

type Props = {
  vault: VaultsTableRow;
};

type CreateVaultWizardProps = Props;

const CreateVaultWizard = ({ vault }: CreateVaultWizardProps): JSX.Element => {
  const [step, setStep] = useState<Steps>(1);

  const handleNextStep = () => setStep((s) => (s + 1) as Steps);

  return (
    <>
      <DisclaimerStep step={step} onClickAgree={handleNextStep} />
      <DespositCollateralStep step={step} onDeposit={handleNextStep} collateralToken={vault.collateralCurrency} />
      <VaultCreatedStep step={step} collateralToken={vault.collateralCurrency} />
    </>
  );
};

export { CreateVaultWizard };
