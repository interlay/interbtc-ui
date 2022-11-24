import styled, { css } from 'styled-components';

import { getOverlayPlacementCSS, overlayCSS } from '../css/overlay';
import { theme } from '../theme';
import { Placement } from '../utils/prop-types';

type StyledTooltipProps = {
  $placement: Placement;
  $isOpen: boolean;
};

type StyledTooltipTipProps = {
  $placement: Placement;
};

const StyledTooltip = styled.div<StyledTooltipProps>`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  vertical-align: top;
  background-color: ${theme.colors.textPrimary};
  padding: ${theme.spacing.spacing2};
  border-radius: ${theme.rounded.rg};
  // TODO: add box-shadow to theme
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.21);
  font-weight: ${theme.fontWeight.book};
  font-size: ${theme.text.s};
  line-height: ${theme.lineHeight.s};
  word-break: break-word;
  -webkit-font-smoothing: antialiased;
  cursor: default;
  user-select: none;

  ${({ $isOpen }) => overlayCSS($isOpen)}
  ${({ $isOpen, $placement }) => $isOpen && getOverlayPlacementCSS($placement)}
  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
      default:
        return css`
          margin-bottom: ${theme.tooltip.offset};
        `;
      case 'bottom':
        return css`
          margin-top: ${theme.tooltip.offset};
        `;
      case 'right':
        return css`
          margin-left: ${theme.tooltip.offset};
        `;
      case 'left':
        return css`
          margin-right: ${theme.tooltip.offset};
        `;
    }
  }}
`;

const StyledTooltipTip = styled.span<StyledTooltipTipProps>`
  position: absolute;
  height: 0;
  width: 0;
  border-style: solid;
  border-width: ${theme.tooltip.tip.width};
  border-top-color: ${theme.colors.textPrimary};
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;

  ${({ $placement }) => {
    switch ($placement) {
      case 'top':
      default:
        return css`
          top: 100%;
          left: 50%;
          margin-left: calc(${theme.tooltip.tip.width} * -1);
        `;
      case 'bottom':
        return css`
          bottom: 100%;
          left: 50%;
          margin-left: calc(${theme.tooltip.tip.width} * -1);
          transform: rotate(-180deg);
        `;
      case 'right':
        return css`
          right: 100%;
          top: 50%;
          margin-top: calc(${theme.tooltip.tip.width} * -1);
          transform: rotate(90deg);
        `;
      case 'left':
        return css`
          left: 100%;
          top: 50%;
          margin-top: calc(${theme.tooltip.tip.width} * -1);
          transform: rotate(-90deg);
        `;
    }
  }}
`;

const StyledTooltipLabel = styled.div`
  max-inline-size: 200px;
`;

export { StyledTooltip, StyledTooltipLabel, StyledTooltipTip };
