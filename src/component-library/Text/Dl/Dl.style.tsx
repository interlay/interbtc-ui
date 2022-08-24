import styled from 'styled-components';

import { theme } from '../../theme';

const DefinitionList = styled.dl`
  display: flex;
  flex-direction: column;
  font-size: ${theme.text.s};

  @media (min-width: 64em) {
    flex-direction: row;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: ${theme.spacing.spacing5};
    padding-bottom: ${theme.spacing.spacing5};
    border-bottom: 1px solid ${theme.colors.textTertiary};
  }

  @media (min-width: 64em) {
    &:not(:last-of-type) {
      margin-right: ${theme.spacing.spacing8};
      padding-right: ${theme.spacing.spacing8};
      border-right: 1px solid ${theme.colors.textTertiary};
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }
`;

const Dt = styled.dt`
  color: ${theme.colors.textTertiary};
  margin-right: ${theme.spacing.spacing2};
`;

const Dd = styled.dd`
  color: ${theme.colors.textPrimary};
`;

export { Dd, DefinitionList, Dt, ListItem };
