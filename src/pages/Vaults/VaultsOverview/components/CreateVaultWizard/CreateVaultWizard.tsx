import { RefObject, useState } from 'react';

import { VaultsTableRow } from '../VaultsTable';
import DespositCollateralStep from './DespositCollateralStep';
import DisclaimerStep from './DisclaimerStep';
import VaultCreatedStep from './VaultCreatedStep';

type Steps = 1 | 2 | 3;

interface CreateVaultWizardProps {
  vault?: VaultsTableRow;
  overlappingModalRef: RefObject<HTMLDivElement>;
}
// TODO: Move this to a generic multi-step component
const CreateVaultWizard = ({ vault, overlappingModalRef }: CreateVaultWizardProps): JSX.Element | null => {
  const [step, setStep] = useState<Steps>(1);

  const handleNextStep = () => setStep((s) => (s + 1) as Steps);

  if (!vault) {
    return null;
  }

  return (
    <>
      <DisclaimerStep step={step} onClickAgree={handleNextStep} />
      <DespositCollateralStep
        step={step}
        onSuccessfulDeposit={handleNextStep}
        collateralCurrency={vault.collateralCurrency}
        minCollateralAmount={vault.minCollateralAmount}
        overlappingModalRef={overlappingModalRef}
      />
      <VaultCreatedStep step={step} collateralCurrency={vault.collateralCurrency} />
    </>
  );
};

export { CreateVaultWizard };
