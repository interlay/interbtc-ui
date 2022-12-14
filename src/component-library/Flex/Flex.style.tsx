import styled from 'styled-components';

import { theme } from '../theme';
import { AlignItems, AlignSelf, Direction, JustifyContent, Spacing, Wrap } from '../utils/prop-types';

type Responsive<T extends number | string> =
  | T
  | {
      S?: T;
      M?: T;
      L?: T;
      // if we want to handle edge cases
      [custom: string]: T | undefined;
    };

const getResponsiveProp = <T extends number | string>(key: string, prop?: T | Responsive<T>) => {
  if (typeof prop === 'object') {
    return `
      ${key}: ${prop.S};

      @media (min-width: 42em) {
        ${key}: ${prop.M};
      }

      @media (min-width: 80em) {
        ${key}: ${prop.L};
      }


    `;
  }

  return `${key}: ${prop}`;
};

type StyledFlexProps = {
  $gap: Spacing;
  $justifyContent?: JustifyContent;
  $alignItems?: AlignItems;
  $direction?: Direction;
  $flex?: string | number;
  $wrap?: Wrap;
  $alignSelf?: AlignSelf;
};

const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  ${({ $direction }) => {
    return getResponsiveProp<Direction>('flex-direction', $direction);
  }}
  /* flex-direction: ${(props) => props.$direction}; */
  justify-content: ${(props) => props.$justifyContent};
  align-items: ${(props) => props.$alignItems};
  gap: ${(props) => theme.spacing[props.$gap]};
  flex: ${(props) => props.$flex};
  flex-wrap: ${(props) => (typeof props.$wrap === 'boolean' ? 'wrap' : props.$wrap)};
  align-self: ${(props) => props.$alignSelf};
`;

export { StyledFlex };
export type { Responsive };
