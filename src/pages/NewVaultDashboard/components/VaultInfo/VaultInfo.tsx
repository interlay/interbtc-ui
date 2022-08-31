import { VaultStatusExt } from '@interlay/interbtc-api';
import React, { HTMLAttributes, ReactNode } from 'react';

import { shortAddress } from '@/common/utils/utils';
import { CTA, DlProps } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

import { StatusTag } from '../StatusTag';
import { StyledDl, StyledWrapper } from './VaultInfo.styles';

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
  vaultStatus: VaultStatusExt;
  vaultAddress: string;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultInfoProps = Props & NativeAttrs;

const VaultInfo = ({ vaultStatus, vaultAddress, ...props }: VaultInfoProps): JSX.Element => {
  const { children: definition, status } = getVaultStatus(vaultStatus);

  const headlineItems: DlProps['listItems'] = [
    { term: 'Vault ID', definition: shortAddress(vaultAddress) },
    {
      term: 'Vault Status',
      definition,
      render: (children: ReactNode) => <StatusTag status={status}>{children}</StatusTag>
    }
  ];

  return (
    <StyledWrapper variant='bordered' {...props}>
      <StyledDl listItems={headlineItems} />
      <CTA size='small' variant='outlined'>
        Replace Vault
      </CTA>
    </StyledWrapper>
  );
};

export { VaultInfo };
export type { VaultInfoProps };
