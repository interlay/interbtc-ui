import styled from 'styled-components';

import { InformationCircle } from '@/assets/icons';
import { Dl, Select, SelectProps, theme, TokenData } from '@/component-library';

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

const SelectWrapper = ({ ...props }: SelectProps<TokenData, 'modal'>) => <Select<TokenData, 'modal'> {...props} />;

const StyledSelect = styled(SelectWrapper)`
  flex-direction: row;
  justify-content: space-between;
`;

export { StyledDl, StyledInformationCircle, StyledSelect };
