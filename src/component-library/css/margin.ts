import { css, DefaultTheme, FlattenInterpolation } from 'styled-components';

import { theme } from '../theme';
import { MarginProps, Spacing } from '../utils/prop-types';

type StyledMarginProps = {
  [K in keyof MarginProps as `$${string & K}`]: MarginProps[K];
};

const getThemeSpacing = (spacing?: Spacing) => spacing && theme.spacing[spacing];

const marginCSS = (props: StyledMarginProps): FlattenInterpolation<DefaultTheme> => css`
  margin: ${getThemeSpacing(props.$margin)};
  margin-top: ${getThemeSpacing(props.$marginTop || props.$marginY)};
  margin-bottom: ${getThemeSpacing(props.$marginBottom || props.$marginY)};
  margin-left: ${getThemeSpacing(props.$marginLeft || props.$marginX)};
  margin-right: ${getThemeSpacing(props.$marginRight || props.$marginX)};
`;

export type { StyledMarginProps };
export { marginCSS };
