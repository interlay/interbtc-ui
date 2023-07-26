import styled, { css } from 'styled-components';

import { Flex, Span, theme } from '@/component-library';

const StyledGrid = styled.div`
  display: grid;
  /* grid-auto-flow: column; */
  /* grid-auto-columns: min-content; */
  grid-template-columns: auto min-content auto auto min-content auto auto min-content auto;
  gap: ${theme.spacing.spacing1};
  grid-template-rows: auto auto auto;
`;

const StyledItem = styled(Flex)``;

const StyledToken = styled(Flex)`
  /* border: 1px solid #cfcfcf;
  background-color: #efefef;
  border-radius: ${theme.rounded.full};
  padding: ${theme.spacing.spacing1};
  display: inline-flex;
  align-items: center;
  justify-content: center; */
`;

const StyledStack = styled(Flex)`
  > :last-child {
    margin-left: calc(${theme.icon.sizes.xl2} * -0.5);
  }
`;

type StyledArrowProps = {
  $hasArrow?: boolean;
};

const StyledArrow = styled.div<StyledArrowProps>`
  position: relative;
  height: 1px;
  border-bottom: 1px dashed black;
  margin-top: auto;
  margin-bottom: auto;
  grid-column: span 2;

  ${({ $hasArrow }) =>
    $hasArrow &&
    css`
      &::after {
        content: '';
        position: absolute;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 6px solid black;
        right: 0;
        top: 50%;
        transform: translate(25%, -50%);
      }
    `}
`;

const StyledBottomArrow = styled.div`
  position: relative;

  grid-column: span 7;
  height: 20px;
  border-left: 1px dashed black;
  border-bottom: 1px dashed black;
  border-right: 1px dashed black;
  margin-left: calc(${theme.icon.sizes.xl2} / 2);
  margin-right: calc((${theme.icon.sizes.xl2} + (${theme.icon.sizes.xl2} / 2)) / 2);

  &::after {
    content: '';
    position: absolute;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid black;
    top: 0;
    transform: translate(-50%, -50%);
  }
`;

const StyledLabel = styled(Span)`
  grid-column: span 3;
  justify-self: center;
`;

export { StyledArrow, StyledBottomArrow, StyledGrid, StyledItem, StyledLabel, StyledStack, StyledToken };
