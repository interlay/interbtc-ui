import styled from 'styled-components';

import { theme } from '../theme';

type InsightsListItemWrapperProps = { hasInfo?: boolean };

export const InsightsListItemWrapper = styled.div<InsightsListItemWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.hasInfo ? 'flex-start' : 'space-between')};
  flex: ${(props) => (props.hasInfo ? '1' : '0 0 auto')};
  gap: ${(props) => !props.hasInfo && theme.spacing.spacing4};

  &:not(:last-of-type) {
    padding-right: ${theme.spacing.spacing8};
    border-right: ${theme.border.default};
  }
`;

export const Card = styled.div`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textSecondary};
  display: flex;
  justify-content: space-between;
  background-color: ${theme.card.bg};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.xl};
  gap: ${theme.spacing.spacing8};
  padding: ${theme.spacing.spacing6};
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
  line-height: ${theme.lineHeight.base};
`;
