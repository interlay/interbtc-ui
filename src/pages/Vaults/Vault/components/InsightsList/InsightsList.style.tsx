import styled from 'styled-components';

import { Card, H2, H3, P, theme } from '@/component-library';

type InsightsListWrapperProps = {
  $isCol: boolean;
};

const InsightsListWrapper = styled(Card)<InsightsListWrapperProps>`
  justify-content: space-between;
  gap: ${theme.spacing.spacing4};

  @media (min-width: 80em) {
    gap: ${(props) => !props.$isCol && theme.spacing.spacing8};
    flex-direction: ${(props) => (props.$isCol ? 'column' : 'row')};
  }
`;

type InsightsListItemWrapperProps = {
  $isCol: boolean;
};

const InsightsListItemWrapper = styled.div<InsightsListItemWrapperProps>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.spacing4};
  flex: 1;

  &:not(:last-of-type) {
    padding-bottom: ${theme.spacing.spacing4};
    border-bottom: ${theme.border.default};
  }

  @media (min-width: 80em) {
    &:not(:last-of-type) {
      padding-bottom: ${(props) => !props.$isCol && 0};
      padding-right: ${(props) => !props.$isCol && theme.spacing.spacing8};
      border-bottom: ${(props) => !props.$isCol && 'none'};
      border-right: ${(props) => !props.$isCol && theme.border.default};
    }
  }
`;

const InsightsTitle = styled.div`
  padding-bottom: ${theme.spacing.spacing4};
  border-bottom: ${theme.border.default};
`;

const InsightItemTitle = styled(H2)`
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
`;

const InsightItemLabel = styled(H3)`
  margin-top: ${theme.spacing.spacing3};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.text.xl2};
  line-height: ${theme.lineHeight.xl};
`;

const InsightItemSubLabel = styled(P)`
  font-size: ${theme.text.xs};
  line-height: ${theme.lineHeight.s};
`;

export {
  InsightItemLabel,
  InsightItemSubLabel,
  InsightItemTitle,
  InsightsListItemWrapper,
  InsightsListWrapper,
  InsightsTitle
};
