import styled from 'styled-components';

import { Card, Dl, DlGroup, theme } from '@/component-library';

const StyledWrapper = styled(Card)`
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.spacing.spacing4};

  @media (min-width: 64em) {
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.spacing10};
  }
`;

const StyledDl = styled(Dl)`
  display: flex;
  flex-direction: column;
  font-size: ${theme.text.s};
  gap: ${theme.spacing.spacing5};

  @media (min-width: 64em) {
    flex-direction: row;
    gap: ${theme.spacing.spacing8};
  }
`;

const StyledDlGroup = styled(DlGroup)`
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    padding-bottom: ${theme.spacing.spacing5};
    border-bottom: ${theme.border.default};
  }

  @media (min-width: 64em) {
    &:not(:last-of-type) {
      padding-right: ${theme.spacing.spacing8};
      border-right: ${theme.border.default};
      padding-bottom: 0;
      border-bottom: none;
    }
  }
`;

export { StyledDl, StyledDlGroup, StyledWrapper };
