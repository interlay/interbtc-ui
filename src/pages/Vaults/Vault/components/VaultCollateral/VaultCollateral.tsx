import { CollateralCurrencyExt, CurrencyExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import { HTMLAttributes, useMemo, useState } from 'react';

import { CTA, MeterRanges } from '@/component-library';
import RequestIssueModal from '@/pages/Vaults/Vault/RequestIssueModal';
import RequestRedeemModal from '@/pages/Vaults/Vault/RequestRedeemModal';
import UpdateCollateralModal, { CollateralUpdateStatus } from '@/pages/Vaults/Vault/UpdateCollateralModal';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { VaultActions } from '../../types';
import { CollateralThresholds } from './CollateralThresholds';
import {
  StyledCoinPairs,
  StyledCollateralScore,
  StyledCollateralWrapper,
  StyledCTAGroup,
  StyledCTAGroups,
  StyledLiquidationPrice,
  StyledLiquidationText,
  StyledWrapper
} from './VaultCollateral.styles';

const getRanges = (liquidationThreshold: Big, premiumRedeemThreshold: Big, secureThreshold: Big): MeterRanges => {
  const formattedLiquidationThreshold = Math.trunc(liquidationThreshold.mul(100).toNumber());
  const formattedPremiumRedeemThreshold = Math.trunc(premiumRedeemThreshold.mul(100).toNumber());
  const formattedSecureThreshold = Math.trunc(secureThreshold.mul(100).toNumber());

  return [0, formattedLiquidationThreshold, formattedPremiumRedeemThreshold, formattedSecureThreshold];
};

// TODO: commented code belongs the next dashboard iteration

type SetVaultAction = {
  vaultAction?: VaultActions;
  isModalOpen: boolean;
};

type Props = {
  collateralToken: CurrencyExt;
  collateral: VaultData['collateral'];
  secureThreshold: Big;
  liquidationThreshold: Big;
  premiumRedeemThreshold: Big;
  remainingCapacity: MonetaryAmount<CollateralCurrencyExt>;
  lockedAmountBTC: Big;
  liquidationPrice: string;
  vaultAddress: string;
  hasVaultActions: boolean;
  collateralScore?: Big;
  wrappedId: string;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultCollateralProps = Props & NativeAttrs;

// TODO: handling props as a single property bypasses some type errors
const VaultCollateral = ({
  collateral,
  vaultAddress,
  collateralToken,
  collateralScore,
  liquidationPrice,
  liquidationThreshold,
  premiumRedeemThreshold,
  secureThreshold,
  // remainingCapacity,
  lockedAmountBTC,
  hasVaultActions,
  wrappedId,
  ...props
}: VaultCollateralProps): JSX.Element => {
  const [{ vaultAction, isModalOpen }, setVaultAction] = useState<SetVaultAction>({
    vaultAction: undefined,
    isModalOpen: false
  });

  const handleClickVaultAction = (action: VaultActions) => setVaultAction({ vaultAction: action, isModalOpen: true });

  const ranges = useMemo(() => getRanges(liquidationThreshold, premiumRedeemThreshold, secureThreshold), [
    liquidationThreshold,
    premiumRedeemThreshold,
    secureThreshold
  ]);

  const lockedBTC = new BitcoinAmount(lockedAmountBTC);

  return (
    <>
      <StyledWrapper variant='bordered' {...props}>
        <StyledCollateralWrapper>
          <StyledCollateralScore
            score={collateralScore?.toNumber()}
            ranges={ranges}
            variant='highlight'
            label='Collateral Score'
          />
          <CollateralThresholds
            liquidationThreshold={liquidationThreshold}
            premiumRedeemThreshold={premiumRedeemThreshold}
            secureThreshold={secureThreshold}
          />
          <StyledLiquidationPrice>
            <StyledLiquidationText color='tertiary'>
              Your current {collateralToken.ticker} Liquidation Price
              <StyledCoinPairs color='primary'>
                {liquidationPrice} {collateralToken.ticker}/BTC
              </StyledCoinPairs>
            </StyledLiquidationText>
          </StyledLiquidationPrice>
        </StyledCollateralWrapper>
        {/* TODO: buttons overflow on smaller screens */}
        {hasVaultActions && (
          <StyledCTAGroups>
            <StyledCTAGroup>
              <CTA fullWidth onClick={() => handleClickVaultAction('deposit')}>
                Deposit Collateral
              </CTA>
              <CTA fullWidth onClick={() => handleClickVaultAction('withdraw')}>
                Withdraw Collateral
              </CTA>
            </StyledCTAGroup>
            <StyledCTAGroup>
              <CTA variant='secondary' fullWidth onClick={() => handleClickVaultAction('issue')}>
                Issue {wrappedId}
              </CTA>
              <CTA variant='secondary' fullWidth onClick={() => handleClickVaultAction('redeem')}>
                Redeem {wrappedId}
              </CTA>
            </StyledCTAGroup>
          </StyledCTAGroups>
        )}
      </StyledWrapper>
      {hasVaultActions && (
        <>
          <RequestIssueModal
            open={isModalOpen && vaultAction === 'issue'}
            vaultAddress={vaultAddress}
            collateralToken={collateralToken}
            onClose={() => setVaultAction((s) => ({ ...s, isModalOpen: false }))}
          />
          <RequestRedeemModal
            open={isModalOpen && vaultAction === 'redeem'}
            vaultAddress={vaultAddress}
            collateralToken={collateralToken}
            onClose={() => setVaultAction((s) => ({ ...s, isModalOpen: false }))}
            lockedBTC={lockedBTC}
          />
          <UpdateCollateralModal
            open={isModalOpen && (vaultAction === 'deposit' || vaultAction === 'withdraw')}
            vaultAddress={vaultAddress}
            collateralToken={collateralToken}
            onClose={() => setVaultAction((s) => ({ ...s, isModalOpen: false }))}
            collateralUpdateStatus={
              vaultAction === 'deposit' ? CollateralUpdateStatus.Deposit : CollateralUpdateStatus.Withdraw
            }
            hasLockedBTC={lockedBTC.gt(BitcoinAmount.zero())}
            collateralTokenAmount={collateral.raw}
          />
        </>
      )}
      {/* <Modal open={isModalOpen} )}>
        {(vaultAction === 'deposit' || vaultAction === 'withdraw') && (
          <CollateralForm
            ranges={ranges}
            score={collateralScore}
            collateral={collateral}
            collateralToken={collateralToken}
            variant={vaultAction}
          />
        )}
        {(vaultAction === 'issue' || vaultAction === 'redeem') && (
          <IssueRedeemForm
            variant={vaultAction}
            collateralToken={collateralToken}
            remainingCapacity={remainingCapacity}
            lockedAmountBTC={lockedAmountBTC}
          />
        )}
      </Modal> */}
    </>
  );
};

export { VaultCollateral };
export type { VaultCollateralProps };
