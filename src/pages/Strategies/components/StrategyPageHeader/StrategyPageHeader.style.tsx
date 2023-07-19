import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledStrategyPageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing6};
  font-weight: ${theme.fontWeight.bold};
`;

const StyledStrategyPageHeaderTitle = styled.h1`
  font-size: ${theme.text.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.spacing2};
`;

const StyledStrategyPageHeaderTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.spacing2};
`;

const StyledStrategyPageHeaderTag = styled.div`
  font-size: ${theme.text.s};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};
  border-radius: ${theme.rounded.full};
  border: ${theme.border.default};
  gap: ${theme.spacing.spacing2};
`;

export {
  StyledStrategyPageHeader,
  StyledStrategyPageHeaderTag,
  StyledStrategyPageHeaderTags,
  StyledStrategyPageHeaderTitle
};
