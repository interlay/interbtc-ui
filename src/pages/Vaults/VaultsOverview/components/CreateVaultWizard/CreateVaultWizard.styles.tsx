import styled from 'styled-components';

import { H2, P, Stack, theme } from '@/component-library';

const DisclaimerHeader = styled(Stack)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledDisclaimerText = styled(P)`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
`;

const StyledDisclaimerBox = styled.div`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.rg};
`;

const StyledDisclaimerList = styled.ol`
  list-style-type: decimal;
  padding: 0 ${theme.spacing.spacing4};
`;

const StyledDisclaimerListItem = styled.li`
  display: list-item;
`;

const StyledDl = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing2};
`;

const StyledDItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.spacing2};
`;

const StyledDt = styled.dt`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
  color: ${theme.colors.textTertiary};
`;

const StyledDd = styled.dd`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
`;

const StyledDepositTitle = styled(H2)`
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  color: #d57b33;
  padding: ${theme.spacing.spacing3};
  border-bottom: 2px solid #feca2f;
  text-align: center;
`;

const StyledHr = styled.hr`
  border: 0;
  border-bottom: ${theme.border.default};
  margin: ${theme.spacing.spacing4} 0;
`;

export {
  DisclaimerHeader,
  StyledDd,
  StyledDepositTitle,
  StyledDisclaimerBox,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText,
  StyledDItem,
  StyledDl,
  StyledDt,
  StyledHr
};
