import styled from 'styled-components';

import { CTA } from '../CTA';
import { Divider } from '../Divider';
import { Flex } from '../Flex';
import { H3 } from '../Text';
import { theme } from '../theme';
import { Sizes } from '../utils/prop-types';

type StyledDialogProps = {
  $size: Sizes;
};

const StyledDialog = styled.section<StyledDialogProps>`
  background: ${theme.colors.bgPrimary};
  border: ${theme.border.default};
  border-radius: ${theme.rounded.md};
  color: ${theme.colors.textPrimary};
  max-width: 100%;
  width: ${({ $size }) => theme.dialog[$size].width};
  display: flex;
  flex-direction: column;
  position: relative;
  outline: none;
`;

const StyledCloseCTA = styled(CTA)`
  position: absolute;
  top: ${theme.spacing.spacing2};
  right: ${theme.spacing.spacing2};
  z-index: ${theme.dialog.closeBtn.zIndex};
`;

const StyledDialogHeader = styled(H3)<StyledDialogProps>`
  padding: ${({ $size }) => theme.dialog[$size].header.padding};
  overflow: hidden;
  flex-shrink: 0;
`;

const StyledDialogDivider = styled(Divider)<StyledDialogProps>`
  margin: ${({ $size }) => `0 ${theme.dialog[$size].divider.marginX} ${theme.dialog[$size].divider.marginBottom}`};
  flex-shrink: 0;
`;

const StyledDialogBody = styled(Flex)<StyledDialogProps>`
  padding: ${({ $size }) => `${theme.dialog[$size].body.paddingY} ${theme.dialog[$size].body.paddingX}`};
  flex: 1 1 auto;
`;

const StyledDialogFooter = styled(Flex)<StyledDialogProps>`
  padding: ${({ $size }) => theme.dialog[$size].footer.padding};
`;

export { StyledCloseCTA, StyledDialog, StyledDialogBody, StyledDialogDivider, StyledDialogFooter, StyledDialogHeader };
