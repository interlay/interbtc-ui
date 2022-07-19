import styled from 'styled-components';

import { theme } from '../theme';

export const Card = styled.div`
  box-shadow: ${theme.boxShadow.default};
  color: ${theme.colors.textSecondary};
  display: flex;
  background-color: ${theme.card.bg};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.xl};
  flex-direction: column;
  gap: ${theme.spacing.spacing8};
  padding: ${theme.spacing.spacing8} ${theme.spacing.spacing4};
`;

export const CardHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing8};
`;

export const CardTitle = styled.h2`
  font-size: ${theme.text.lg};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.lg};
  text-align: center;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.spacing8};
`;

export const StyledDl = styled.dl`
  background-color: ${theme.card.secondaryBg};
  border-radius: ${theme.rounded.md};
  font-size: ${theme.text.s};
  font-weight: ${theme.fontWeight.medium};
  padding: ${theme.spacing.spacing4};
`;

export const DlItem = styled.div`
  align-items: space-between;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  dt {
    color: ${theme.colors.textTertiary};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const CTAWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
