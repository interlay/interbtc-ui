import styled from 'styled-components';

import { Card, H3, P, Stack, Strong, Table, Tabs, theme } from '@/component-library';
import { hideScrollbar } from '@/component-library/css';

const StyledWrapper = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledStack = styled(Stack)`
  width: 100%;
  text-align: right;
`;

const StyledTabs = styled(Tabs)`
  text-align: right;
`;

const StyledTitle = styled(H3)`
  font-size: ${theme.text.xl2};
  line-height: ${theme.lineHeight.lg};
  padding: ${theme.spacing.spacing3} 0;
`;

const StyledStatus = styled.div`
  display: flex;
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};
  font-weight: ${theme.fontWeight.book};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
  color: #ffffff;
`;

const StyledTable = styled(Table)`
  text-align: left;
  margin-top: ${theme.spacing.spacing4};
`;

const StyledRequestCell = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledRequest = styled(Strong)`
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
`;

const StyledDate = styled(P)`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
  white-space: nowrap;
`;

const StyledTableWrapper = styled.div`
  overflow-x: auto;
  ${hideScrollbar()}
`;

export {
  StyledDate,
  StyledRequest,
  StyledRequestCell,
  StyledStack,
  StyledStatus,
  StyledTable,
  StyledTableWrapper,
  StyledTabs,
  StyledTitle,
  StyledWrapper
};
