import styled from 'styled-components';

import { theme } from 'component-library';
import { NumberInput } from 'component-library/NumberInput';

const TokenFieldWrapper = styled.div`
  position: relative;
`;

const TokenFieldLabel = styled.label`
  font-size: ${theme.text.xl2};
  color: ${theme.colors.textTertiary};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.s};
  position: absolute;
  right: ${theme.spacing.spacing4};
  top: ${theme.spacing.spacing2};
`;

const TokenFieldInput = styled(NumberInput)`
  font-size: ${theme.text.xl5};
  padding-right: ${theme.spacing.spacing8};
`;

const TokenFieldUSD = styled.span`
  display: block;
  font-size: ${theme.text.xl};
  color: ${theme.colors.textTertiary};
  text-align: right;
  position: absolute;
  right: ${theme.spacing.spacing4};
  bottom: ${theme.spacing.spacing2};
`;

export {
  TokenFieldWrapper,
  TokenFieldLabel,
  TokenFieldInput,
  TokenFieldUSD
};
