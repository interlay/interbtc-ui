import { CollateralCurrencyExt, VaultStatusExt } from '@interlay/interbtc-api';
import { BitcoinAmount, MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import React, { HTMLAttributes, useState } from 'react';

import { shortAddress } from '@/common/utils/utils';
import { CTA, Dd, Dt } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';
import RequestReplacementModal from '@/pages/Vaults/Vault/RequestReplacementModal';

import { StatusTag } from '../StatusTag';
import { StyledDl, StyledDlGroup, StyledWrapper } from './VaultInfo.styles';

// TODO: move these to dictionary file
const getVaultStatus = (vaultStatus: VaultStatusExt): { children: React.ReactNode; status: Status } => {
  switch (vaultStatus) {
    case VaultStatusExt.Active: {
      return { children: 'Active', status: 'success' };
    }
    case VaultStatusExt.Inactive: {
      return { children: 'Issuing disabled', status: 'warning' };
    }
    case VaultStatusExt.Liquidated: {
      return { children: 'Liquidated', status: 'error' };
    }
    default: {
      return { children: 'Undefined', status: 'warning' };
    }
  }
};

type Props = {
  collateralAmount: MonetaryAmount<CollateralCurrencyExt>;
  vaultStatus: VaultStatusExt;
  vaultAddress: string;
  vaultDisplayName: string | undefined;
  collateralToken: CollateralCurrencyExt;
  lockedAmountBTC: Big;
  hasManageVaultBtn: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultInfoProps = Props & NativeAttrs;

const VaultInfo = ({
  vaultStatus,
  vaultAddress,
  vaultDisplayName,
  collateralToken,
  collateralAmount,
  lockedAmountBTC,
  hasManageVaultBtn,
  ...props
}: VaultInfoProps): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { children: vaultStatusDefinition, status } = getVaultStatus(vaultStatus);

  return (
    <StyledWrapper variant='bordered' {...props}>
      <StyledDl>
        <StyledDlGroup gap='spacing2'>
          <Dt>Vault ID:</Dt>
          <Dd>{shortAddress(vaultAddress)}</Dd>
        </StyledDlGroup>
        <StyledDlGroup gap='spacing2'>
          <StatusTag status={status}>
            <Dt>Vault Status:</Dt>
            <Dd>{vaultStatusDefinition}</Dd>
          </StatusTag>
        </StyledDlGroup>
        {vaultDisplayName && (
          <StyledDlGroup gap='spacing2'>
            <Dt>Identity</Dt>
            <Dd>{vaultDisplayName}</Dd>
          </StyledDlGroup>
        )}
      </StyledDl>
      {hasManageVaultBtn && (
        <CTA size='small' variant='outlined' onClick={() => setModalOpen(true)}>
          Replace Vault
        </CTA>
      )}
      <RequestReplacementModal
        collateralAmount={collateralAmount}
        collateralToken={collateralToken}
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        vaultAddress={vaultAddress}
        lockedBTC={new BitcoinAmount(lockedAmountBTC)}
      />
    </StyledWrapper>
  );
};

export { VaultInfo };
export type { VaultInfoProps };
