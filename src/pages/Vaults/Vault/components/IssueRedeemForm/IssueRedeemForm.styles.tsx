import styled from 'styled-components';

import { H2, P, theme } from '@/component-library';

const StyledDl = styled.dl``;

const StyledDItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.spacing2};
`;

const StyledDt = styled.dt`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.spacing2};
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.base};
  color: ${theme.colors.textTertiary};
`;

const StyledDd = styled.dd`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.lg};
`;

const StyledTitle = styled(H2)`
  font-size: ${theme.text.base};
  line-height: ${theme.lineHeight.lg};
  color: #d57b33;
  padding: ${theme.spacing.spacing3};
  border-bottom: 2px solid #feca2f;
  text-align: center;
`;

const StyledDescription = styled(P)`
  text-align: center;
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.lg};
`;

const StyledHr = styled.hr`
  border: 0;
  border-bottom: ${theme.border.default};
`;

type StyledHighlightDItemProps = {
  $clickable: boolean;
};

const StyledHighlightDItem = styled.div<StyledHighlightDItemProps>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.rounded.md};
  padding: ${theme.spacing.spacing3};
  cursor: ${(props) => props.$clickable && 'pointer'};
`;

const StyledHighlightDt = styled.dt`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
  margin-bottom: ${theme.spacing.spacing3};
  color: ${theme.colors.textTertiary};
`;

const StyledHighlightDd = styled.dd`
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.lg};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.lg};
`;

const StyledInputLabel = styled.label`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.lg};
  color: ${theme.colors.textTertiary};
`;

export {
  StyledDd,
  StyledDescription,
  StyledDItem,
  StyledDl,
  StyledDt,
  StyledHighlightDd,
  StyledHighlightDItem,
  StyledHighlightDt,
  StyledHr,
  StyledInputLabel,
  StyledTitle
};
