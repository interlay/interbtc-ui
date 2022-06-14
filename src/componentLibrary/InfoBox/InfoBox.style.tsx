import styled from 'styled-components';

import { theme } from '../';

const InfoBoxWrapper = styled.div`
  background: ${theme.card.bg};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.xl};
  font-family: ${theme.font.primary};
  font-weight: ${theme.fontWeight.bold};
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
  color: ${theme.colors.textAccent};
  line-height: ${theme.lineHeight.xl};
  font-size: ${theme.text.xl3};
`;

export { InfoBoxWrapper, InfoBoxHeader, InfoBoxText };
