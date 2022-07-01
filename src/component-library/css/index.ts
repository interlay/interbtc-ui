import { css, DefaultTheme, FlattenInterpolation } from 'styled-components';

import { theme } from 'component-library';

const spaceX = (level: keyof typeof theme.spacing): FlattenInterpolation<DefaultTheme> => css`
  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: ${theme.spacing[level]};
  }
`;

const spaceY = (level: keyof typeof theme.spacing): FlattenInterpolation<DefaultTheme> => css`
  & > :not([hidden]) ~ :not([hidden]) {
    margin-top: ${theme.spacing[level]};
  }
`;

export { spaceX, spaceY };