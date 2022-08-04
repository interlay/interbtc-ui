import styled from 'styled-components';

import { Card } from '../Card';
import { theme } from '../theme';
import { breakpoints } from '../utils/breakpoints';

type InsightsListItemWrapperProps = { hasInfo?: boolean };

export const InsightsListItemWrapper = styled.div<InsightsListItemWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.hasInfo ? 'flex-start' : 'space-between')};
  flex: ${(props) => (props.hasInfo ? '1' : '0 0 auto')};
  gap: ${(props) => !props.hasInfo && theme.spacing.spacing4};

  &:not(:last-of-type) {
    padding-bottom: ${theme.spacing.spacing8};
    border-bottom: ${theme.border.default};
  }

  @media ${breakpoints.large} {
    &:not(:last-of-type) {
      padding-bottom: 0;
      padding-right: ${theme.spacing.spacing8};
      border-bottom: none;
      border-right: ${theme.border.default};
    }
  }
`;

export const InsightsListWrapper = styled(Card)`
  justify-content: space-between;
  gap: ${theme.spacing.spacing8};

  @media ${breakpoints.large} {
    flex-direction: row;
  }
`;

export const InsightTitle = styled.h2`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
  margin-bottom: ${theme.spacing.spacing2};
`;

export const InsightLabel = styled.p`
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.xl4};
  line-height: ${theme.lineHeight.xl};
`;

export const InsightSubLabel = styled.p`
  color: ${theme.colors.textTertiary};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.base};
`;
