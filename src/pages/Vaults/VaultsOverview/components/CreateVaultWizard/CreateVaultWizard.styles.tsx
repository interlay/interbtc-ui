import styled from 'styled-components';

import { ReactComponent as WarningIcon } from '@/assets/img/icons/exclamation-triangle.svg';
import { ModalHeader, P, theme } from '@/component-library';

const StyledModalHeader = styled(ModalHeader)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.spacing1};
`;

const StyledDisclaimerText = styled(P)`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
`;

const StyledWarningIcon = styled(WarningIcon)`
  width: ${theme.spacing.spacing10};
  height: ${theme.spacing.spacing10};
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

const StyledHr = styled.hr`
  border: 0;
  border-bottom: ${theme.border.default};
  margin: ${theme.spacing.spacing4} 0;
`;

export {
  StyledDd,
  StyledDisclaimerCard,
  StyledDisclaimerList,
  StyledDisclaimerListItem,
  StyledDisclaimerText,
  StyledDItem,
  StyledDl,
  StyledDt,
  StyledHr,
  StyledModalHeader,
  StyledWarningIcon
};
