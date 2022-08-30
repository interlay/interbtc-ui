import { CollateralCurrencyExt, CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { HTMLAttributes, useMemo, useState } from 'react';

import { CTA, Modal } from '@/component-library';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { CollateralStatus, CollateralStatusRanges, VaultActions } from '../../types';
import { getCollateralStatus } from '../../utils';
import { CollateralForm } from '../CollateralForm';
import { IssueRedeemForm } from '../IssueRedeemForm';
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

const getVaultCollateralLabel = (status: CollateralStatus, ranges: CollateralStatusRanges) => {
  switch (status) {
    case 'error':
      return `High Risk: ${ranges.error.min}-${ranges.error.max}%`;
    case 'warning':
      return `Medium Risk: ${ranges.warning.min}-${ranges.warning.max}%`;
    case 'success':
      return `Low Risk: ${ranges.success.min}-${ranges.success.max}%`;
  }
};

type SetVaultAction = {
  vaultAction?: VaultActions;
  isModalOpen: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  collateralToken: CurrencyExt;
  collateralScore: number;
  collateral: VaultData['collateral'];
  secureThreshold: VaultData['secureThreshold'];
  liquidationThreshold: VaultData['liquidationThreshold'];
  premiumRedeemThreshold: VaultData['premiumRedeemThreshold'];
  remainingCapacity: MonetaryAmount<CollateralCurrencyExt>;
  lockedAmountBTC: string;
  liquidationPrice: string;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultCollateralProps = Props & NativeAttrs;

// TODO: handling props as a single property bypasses some type errors
const VaultCollateral = ({
  collateral,
  collateralToken,
  collateralScore,
  liquidationPrice,
  liquidationThreshold,
  premiumRedeemThreshold,
  secureThreshold,
  remainingCapacity,
  lockedAmountBTC,
  ...props
}: VaultCollateralProps): JSX.Element => {
  const [{ vaultAction, isModalOpen }, setVaultAction] = useState<SetVaultAction>({
    vaultAction: undefined,
    isModalOpen: false
  });

  const handleClickVaultAction = (action: VaultActions) => setVaultAction({ vaultAction: action, isModalOpen: true });

  const ranges = useMemo(
    () => ({
      error: { min: 0, max: liquidationThreshold.toNumber() * 100 },
      warning: {
        min: liquidationThreshold.toNumber() * 100,
        max: premiumRedeemThreshold.toNumber() * 100
      },
      success: {
        min: premiumRedeemThreshold.toNumber() * 100,
        max: secureThreshold.toNumber() * 100
      }
    }),
    [liquidationThreshold, premiumRedeemThreshold, secureThreshold]
  );

  const collateralStatus = getCollateralStatus(collateralScore, ranges);
  const collateralLabel = getVaultCollateralLabel(collateralStatus, ranges);

  return (
    <>
      <StyledWrapper variant='bordered' {...props}>
        <StyledCollateralWrapper>
          <StyledCollateralScore
            score={collateralScore}
            ranges={ranges}
            variant='highlight'
            label='Collateral Score'
            sublabel={collateralLabel}
          />
          <StyledLiquidationPrice>
            <StyledLiquidationText color='tertiary'>
              Your current {collateralToken.ticker} Liquidation Price
              <StyledCoinPairs color='primary'>{liquidationPrice}</StyledCoinPairs>
            </StyledLiquidationText>
          </StyledLiquidationPrice>
        </StyledCollateralWrapper>
        {/* TODO: buttons overflow on smaller screens */}
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
              Issue kBTC
            </CTA>
            <CTA variant='secondary' fullWidth onClick={() => handleClickVaultAction('redeem')}>
              Redeem kBTC
            </CTA>
          </StyledCTAGroup>
        </StyledCTAGroups>
      </StyledWrapper>
      <Modal open={isModalOpen} onClose={() => setVaultAction((s) => ({ ...s, open: false }))}>
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
      </Modal>
    </>
  );
};

export { VaultCollateral };
export type { VaultCollateralProps };
