import styled from 'styled-components';

import { theme } from '../../theme';
import { BaseTextProps } from '../types';

const DefinitionList = styled.dl<BaseTextProps>`
  display: flex;
  font-size: ${theme.text.s};
`;

const ListItem = styled.div`
  border-right: 1px solid ${theme.colors.textTertiary};
  display: flex;
  margin-right: ${theme.spacing.spacing10};
  padding-right: ${theme.spacing.spacing10};

  &:last-of-type {
    border-right: none;
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
