import styled from 'styled-components';

import { ReactComponent as WarningIcon } from '@/assets/img/icons/exclamation-triangle.svg';
import { H2, P, theme } from '@/component-library';

const StyledDisclaimerText = styled(P)`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
`;

const StyledWarningIcon = styled(WarningIcon)`
  width: ${theme.spacing.spacing12};
  height: ${theme.spacing.spacing12};
`;

const StyledDisclaimerCard = styled.div`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.rg};
  background-color: ${theme.card.secondaryBg};
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
  color: ${theme.modal.title.secondary.color};
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.base};
  padding: ${theme.spacing.spacing3};
  border-bottom: 2px solid ${theme.colors.textSecondary};
  text-align: center;
`;

const StyledHr = styled.hr`
  border: 0;
  border-bottom: ${theme.border.default};
  margin: ${theme.spacing.spacing4} 0;
`;

export {
  StyledDd,
  StyledDepositTitle,
  StyledDisclaimerCard,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText,
  StyledDItem,
  StyledDl,
  StyledDt,
  StyledHr,
  StyledWarningIcon
};
