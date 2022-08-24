import { HTMLAttributes, ReactNode } from 'react';

import { CTA, DlProps } from '@/component-library';

import { StatusTag } from '../StatusTag';
import { StyledDl, StyledWrapper } from './VaultInfo.styles';

const headlineItems: DlProps['listItems'] = [
  { term: 'Vault ID', definition: '0xb7...40fab' },
  {
    term: 'Vault Status',
    definition: 'Active',
    render: (children: ReactNode) => <StatusTag status='success'>{children}</StatusTag>
  }
];

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type VaultInfoProps = Props & NativeAttrs;

const VaultInfo = (props: VaultInfoProps): JSX.Element => (
  <StyledWrapper variant='bordered' {...props}>
    <StyledDl listItems={headlineItems} />
    <CTA size='small' variant='outlined'>
      Manage Vault
    </CTA>
  </StyledWrapper>
);

export { VaultInfo };
export type { VaultInfoProps };
