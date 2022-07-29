import styled from 'styled-components';

import { theme } from '@/component-library';
import { Status } from '@/component-library/utils/prop-types';

type StyledChipProps = {
  $variant: Status;
};

const StyledTag = styled.div<StyledChipProps>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};
  border-radius: ${theme.rounded.full};
  border: ${theme.border.default};
  border-color: ${(props) => theme.transation.status.color[props.$variant]};
  background-color: ${(props) => theme.transation.status.bg[props.$variant]};
  gap: ${theme.spacing.spacing2};
`;

export { StyledTag };
