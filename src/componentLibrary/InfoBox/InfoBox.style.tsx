import styled from 'styled-components';

import { theme } from '../';

const InfoBoxWrapper = styled.div`
  align-items: center;
  box-shadow: ${theme.boxShadow.default};
  background: ${theme.card.bg};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.xl};
  display: flex;
  font-weight: ${theme.fontWeight.bold};
  justify-content: space-between;
  padding: ${theme.spacing.spacing5};
  width: 100%;
`;

const InfoBoxHeader = styled.h2`
  color: ${theme.colors.textTertiary};
  line-height: ${theme.lineHeight.s};
  font-size: ${theme.text.s};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.spacing3};
`;

const InfoBoxText = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.xl};
  font-size: ${theme.text.xl3};
`;

export { InfoBoxWrapper, InfoBoxHeader, InfoBoxText };
