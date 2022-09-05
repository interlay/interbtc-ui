import styled from 'styled-components';

import { H2, theme } from '@/component-library';

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

const StyledTitle = styled(H2)`
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

export { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr, StyledTitle };
