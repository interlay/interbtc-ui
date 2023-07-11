import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';

interface VaultsDepositCollateralAction {
  type: Transaction.VAULTS_DEPOSIT_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['depositCollateral']>;
}

interface VaultsWithdrawCollateralAction {
  type: Transaction.VAULTS_WITHDRAW_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['withdrawCollateral']>;
}

interface VaultsRegisterNewCollateralAction {
  type: Transaction.VAULTS_REGISTER_NEW_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['registerNewCollateralVault']>;
}

type VaultsActions = VaultsDepositCollateralAction | VaultsWithdrawCollateralAction | VaultsRegisterNewCollateralAction;

export type { VaultsActions };
