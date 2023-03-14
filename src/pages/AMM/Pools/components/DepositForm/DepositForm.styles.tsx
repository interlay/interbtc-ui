import styled from 'styled-components';

import { Divider, Dl, DlGroup, theme } from '@/component-library';

const StyledDl = styled(Dl)`
  background-color: ${theme.card.secondaryBg};
  padding: ${theme.spacing.spacing4};
  font-size: ${theme.text.xs};
  border-radius: ${theme.rounded.rg};
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCircle = styled.div`
  display: inline-flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing2};
  background-color: var(--colors-token-input-end-adornment-bg);
  border-radius: ${theme.rounded.full};
`;

const StyledBackground = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing8};
  background-color: ${theme.colors.bgPrimary};
`;

const StyledDivider = styled(Divider)`
  background-color: var(--colors-token-input-end-adornment-bg);
`;

const StyledDlGroup = styled(DlGroup)`
  flex-direction: column;

  @media (min-width: 30em) {
    flex-direction: row;
  }
`;

export { StyledBackground, StyledCircle, StyledDivider, StyledDl, StyledDlGroup, StyledWrapper };
