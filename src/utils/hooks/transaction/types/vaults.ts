import { InterBtcApi } from '@interlay/interbtc-api';

import { Transaction } from '../types';
import { TransactionAction } from '.';

interface VaultsDepositCollateralAction extends TransactionAction {
  type: Transaction.VAULTS_DEPOSIT_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['depositCollateral']>;
}

interface VaultsWithdrawCollateralAction extends TransactionAction {
  type: Transaction.VAULTS_WITHDRAW_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['withdrawCollateral']>;
}

interface VaultsRegisterNewCollateralAction extends TransactionAction {
  type: Transaction.VAULTS_REGISTER_NEW_COLLATERAL;
  args: Parameters<InterBtcApi['vaults']['registerNewCollateralVault']>;
}

type VaultsActions = VaultsDepositCollateralAction | VaultsWithdrawCollateralAction | VaultsRegisterNewCollateralAction;

export type { VaultsActions };
