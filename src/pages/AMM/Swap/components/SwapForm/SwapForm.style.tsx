import styled from 'styled-components';

import { Divider, theme } from '@/component-library';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCircle = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing2};
  background-color: #eeeeee;
  border-radius: ${theme.rounded.full};

  border: 16px solid ${theme.colors.bgPrimary};
`;

const StyledDivider = styled(Divider)`
  background-color: #eeeeee;
`;

export { StyledCircle, StyledDivider, StyledWrapper };
