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

const visuallyHidden = (): FlattenInterpolation<DefaultTheme> => css`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  clip-path: inset(50%);
  height: 1px;
  margin: 0px -1px -1px 0px;
  overflow: hidden;
  padding: 0px;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`;

export { hideScrollbar, spaceX, spaceY, visuallyHidden };
