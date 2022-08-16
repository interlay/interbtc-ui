import { HTMLAttributes, useState } from 'react';

import { CTA } from '@/component-library';

import { CollateralModal, CollateralModalVariants } from '../CollateralModal';
import { IssueRedeemModal, IssueRedeemModalVariants } from '../IssueRedeemModal';
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

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultCollateralProps = Props & NativeAttrs;

const ranges = {
  error: { min: 0, max: 150 },
  warning: { min: 150, max: 250 },
  success: { min: 250, max: 300 }
};

const VaultCollateral = (props: VaultCollateralProps): JSX.Element => {
  const [collateralAction, setCollateralAction] = useState<CollateralModalVariants>();
  const [vaultAction, setVaultAction] = useState<IssueRedeemModalVariants>();

  const handleClickDeposit = () => setCollateralAction('deposit');

  const handleClickWithdraw = () => setCollateralAction('withdraw');

  const handleClickIssue = () => setVaultAction('issue');

  const handleClickRedeem = () => setVaultAction('redeem');

  return (
    <>
      <StyledWrapper variant='bordered' {...props}>
        <StyledCollateralWrapper>
          <StyledCollateralScore
            score={0}
            ranges={ranges}
            variant='highlight'
            label='Collateral Score'
            sublabel='High Risk: 0-150%'
          />
          <StyledLiquidationPrice>
            <StyledLiquidationText color='tertiary'>
              Your current KSM Liquidation Price
              <StyledCoinPairs color='primary'>113.92 KSM/BTC</StyledCoinPairs>
            </StyledLiquidationText>
          </StyledLiquidationPrice>
        </StyledCollateralWrapper>
        {/* TODO: buttons overflow on smaller screens */}
        <StyledCTAGroups>
          <StyledCTAGroup>
            <CTA fullWidth onClick={handleClickDeposit}>
              Deposit Collateral
            </CTA>
            <CTA fullWidth onClick={handleClickWithdraw}>
              Withdraw Collateral
            </CTA>
          </StyledCTAGroup>
          <StyledCTAGroup>
            <CTA variant='secondary' fullWidth onClick={handleClickIssue}>
              Issue kBTC
            </CTA>
            <CTA variant='secondary' fullWidth onClick={handleClickRedeem}>
              Redeem kBTC
            </CTA>
          </StyledCTAGroup>
        </StyledCTAGroups>
      </StyledWrapper>
      <CollateralModal
        variant={collateralAction}
        open={!!collateralAction}
        onClose={() => setCollateralAction(undefined)}
      />
      <IssueRedeemModal variant={vaultAction} open={!!vaultAction} onClose={() => setVaultAction(undefined)} />
    </>
  );
};

export { VaultCollateral };
export type { VaultCollateralProps };
