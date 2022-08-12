import { css, DefaultTheme, FlattenInterpolation } from 'styled-components';

import { theme } from '../theme';

// TODO: not used for now
// TODO: this makes the child elements of a container have a margin-left of the same value
// const Container = styled.div`
//   ${spaceX('spacing1')}
// `;
// <Container>
//   <span>Hello</span>
//   <span>Hi</span>
//   <span>Hey</span>
// </Container>

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

const hideScrollbar = (): FlattenInterpolation<DefaultTheme> => css`
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export { hideScrollbar, spaceX, spaceY };
