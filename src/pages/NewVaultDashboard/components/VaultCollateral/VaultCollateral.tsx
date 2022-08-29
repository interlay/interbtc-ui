import { CurrencyExt } from '@interlay/interbtc-api';
import { HTMLAttributes, useState } from 'react';

import { CTA, Modal } from '@/component-library';
import { VaultData } from '@/utils/hooks/api/vaults/get-vault-data';

import { CollateralActions } from '../../types';
import { CollateralModal } from '../CollateralModal';
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
type Props = {
  collateralToken: CurrencyExt;
  collateralScore: number;
  collateral: VaultData['collateral'];
  secureThreshold: VaultData['secureThreshold'];
  liquidationThreshold: VaultData['liquidationThreshold'];
  premiumRedeemThreshold: VaultData['premiumRedeemThreshold'];
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
  ...props
}: VaultCollateralProps): JSX.Element => {
  const [collateralAction, setCollateralAction] = useState<CollateralActions>();
  const [vaultAction, setVaultAction] = useState<IssueRedeemModalVariants>();

  const handleClickDeposit = () => setCollateralAction('deposit');

  const handleClickWithdraw = () => setCollateralAction('withdraw');

  const handleClickIssue = () => setVaultAction('issue');

  const handleClickRedeem = () => setVaultAction('redeem');

  const ranges = {
    error: { min: 0, max: liquidationThreshold.toNumber() * 100 },
    warning: {
      min: liquidationThreshold.toNumber() * 100,
      max: premiumRedeemThreshold.toNumber() * 100
    },
    success: {
      min: premiumRedeemThreshold.toNumber() * 100,
      max: secureThreshold.toNumber() * 100
    }
  };

  return (
    <>
      <StyledWrapper variant='bordered' {...props}>
        <StyledCollateralWrapper>
          <StyledCollateralScore
            score={collateralScore}
            ranges={ranges}
            variant='highlight'
            label='Collateral Score'
            sublabel='High Risk: 0-150%'
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
      <Modal open={!!collateralAction} onClose={() => setCollateralAction(undefined)}>
        <CollateralModal
          ranges={ranges}
          score={collateralScore}
          collateral={collateral}
          token={collateralToken}
          variant={collateralAction}
        />
      </Modal>
      <IssueRedeemModal variant={vaultAction} open={!!vaultAction} onClose={() => setVaultAction(undefined)} />
    </>
  );
};

export { VaultCollateral };
export type { VaultCollateralProps };
