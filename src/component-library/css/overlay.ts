import { css, DefaultTheme, FlattenInterpolation } from 'styled-components';

import { theme } from '../theme';
import { Placement } from '../utils/prop-types';

const getOverlayPlacementCSS = (placement: Placement): FlattenInterpolation<DefaultTheme> => {
  switch (placement) {
    case 'top':
    default:
      return css`
        transform: translateY(calc(${theme.overlay.placement.transform} * -1));
      `;
    case 'bottom':
      return css`
        transform: translateY(${theme.overlay.placement.transform});
      `;
    case 'right':
      return css`
        transform: translateX(${theme.overlay.placement.transform});
      `;
    case 'left':
      return css`
        transform: translateX(calc(${theme.overlay.placement.transform} * -1));
      `;
  }
};

const overlayCSS = (isOpen: boolean): FlattenInterpolation<DefaultTheme> =>
  css`
    visibility: ${isOpen ? 'visible' : 'hidden'};
    opacity: ${isOpen ? 1 : 0};
    pointer-events: ${isOpen ? 'auto' : 'none'};
  `;

export { getOverlayPlacementCSS, overlayCSS };
