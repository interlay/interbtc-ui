import styled from 'styled-components';

import { InformationCircle } from '@/assets/icons';
import { Dl, DlGroup, Select, SelectProps, theme, TokenData } from '@/component-library';

const StyledDl = styled(Dl)`
  border: ${theme.border.default};
  background-color: ${theme.card.bg.tertiary};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.lg};
`;

const StyledInformationCircle = styled(InformationCircle)`
  margin-left: ${theme.spacing.spacing2};
  vertical-align: text-top;
`;

const SelectWrapper = ({ ...props }: SelectProps<'modal', TokenData>) => <Select<'modal', TokenData> {...props} />;

const StyledSelect = styled(SelectWrapper)`
  flex-direction: row;
  justify-content: space-between;
`;

// This custom padding helps to keep harmony between normal elements and elements with small select
const StyledDlGroup = styled(DlGroup)`
  &:first-of-type {
    padding-bottom: 0.407rem;
  }

  &:not(:first-of-type):not(:last-of-type) {
    padding: 0.407rem 0;
  }

  &:last-of-type {
    padding-top: 0.407rem;
  }
`;

export { StyledDl, StyledDlGroup, StyledInformationCircle, StyledSelect };
